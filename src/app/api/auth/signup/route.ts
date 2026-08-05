import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const { name, email, password, company, role, isAdminSignup, adminCode } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long." }, { status: 400 });
    }

    if (isAdminSignup) {
      const secret = process.env.ADMIN_SIGNUP_SECRET || "dev-admin-secret-123";
      if (adminCode !== secret) {
        return NextResponse.json({ error: "Unauthorized: Invalid Admin Access Code." }, { status: 403 });
      }
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Determine role
    const assignedRole = isAdminSignup ? "ADMIN" : "USER";

    // Create user within a transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: assignedRole,
          // IMPORTANT: Schema default is `false` — preserves all existing users.
          // We explicitly set `true` only for new non-admin signups going forward,
          // so middleware can enforce Xero connection before dashboard access.
          requiresXeroOnboarding: !isAdminSignup,
        },
      });

      // For admin signups: create a placeholder workspace immediately.
      // For regular users: workspace is created in /api/xero/callback using the
      // real Xero org name — no manual company name needed.
      if (isAdminSignup && company) {
        const workspace = await tx.workspace.create({
          data: { 
            name: company,
            trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          },
        });
        await tx.workspaceMember.create({
          data: {
            userId: newUser.id,
            workspaceId: workspace.id,
            role: "ADMIN",
          },
        });
      }
      return newUser;
    });

    // Issue tokens
    const tokenPayload = { userId: user.id, email: user.email!, role: user.role };
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    // Save refresh token to DB (HASHED)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    
    await prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";

    cookieStore.set("futrix_access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    cookieStore.set("futrix_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    // Keep these for UI headers
    cookieStore.set("futrix_user_email", email, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("futrix_user_name", name, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    cookieStore.set("futrix_user_role", user.role, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    // Middleware-readable onboarding flag — NOT httpOnly so Edge middleware can check it without a DB round-trip.
    cookieStore.set("futrix_requires_xero_onboarding", String(user.requiresXeroOnboarding), {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    if (isAdminSignup) {
      const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
      cookieStore.set("futrix_trial_ends_at", trialEndsAt.toISOString(), {
        httpOnly: false,
        secure: isProduction,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Account created successfully! Welcome to Futrix.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        requiresXeroOnboarding: user.requiresXeroOnboarding,
        // Tell the client where to redirect after signup
        redirectTo: isAdminSignup ? "/admin" : "/connect-xero",
      },
    });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}

