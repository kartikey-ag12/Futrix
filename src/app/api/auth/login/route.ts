import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const { email, password, remember } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    // Find user — include requiresXeroOnboarding to set middleware-readable cookie
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        passwordHash: true,
        requiresXeroOnboarding: true,
      },
    });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Issue tokens
    const tokenPayload = { userId: user.id, email: user.email!, role: user.role };
    const accessToken = await signAccessToken(tokenPayload);
    const refreshToken = await signRefreshToken(tokenPayload);

    // Save refresh token (HASHED)
    const refreshAgeDays = remember ? 30 : 7;
    const expiresAt = new Date(Date.now() + refreshAgeDays * 24 * 60 * 60 * 1000);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    await prisma.refreshToken.create({
      data: { token: hashedRefreshToken, userId: user.id, expiresAt },
    });

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === "production";
    const maxAge = refreshAgeDays * 24 * 60 * 60;

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
      maxAge,
    });

    cookieStore.set("futrix_user_email", email, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge,
    });

    cookieStore.set("futrix_user_name", user.name || "", {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge,
    });

    cookieStore.set("futrix_user_role", user.role, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge,
    });

    // Middleware-readable onboarding flag — NOT httpOnly so proxy.ts (Edge) can read it.
    // Existing users have requiresXeroOnboarding=false from DB default, so they're unaffected.
    cookieStore.set("futrix_requires_xero_onboarding", String(user.requiresXeroOnboarding), {
      httpOnly: false,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge,
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully logged in!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        requiresXeroOnboarding: user.requiresXeroOnboarding,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
