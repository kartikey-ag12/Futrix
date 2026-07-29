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

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
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

    // Save refresh token
    const refreshAgeDays = remember ? 30 : 7;
    const expiresAt = new Date(Date.now() + refreshAgeDays * 24 * 60 * 60 * 1000);
    
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
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
      maxAge: refreshAgeDays * 24 * 60 * 60,
    });

    cookieStore.set("futrix_user_email", email, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: refreshAgeDays * 24 * 60 * 60,
    });

    cookieStore.set("futrix_user_name", user.name || "", {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: refreshAgeDays * 24 * 60 * 60,
    });

    cookieStore.set("futrix_user_role", user.role, {
      httpOnly: false,
      secure: isProduction,
      path: "/",
      maxAge: refreshAgeDays * 24 * 60 * 60,
    });

    return NextResponse.json({
      status: "success",
      message: "Successfully logged in!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
