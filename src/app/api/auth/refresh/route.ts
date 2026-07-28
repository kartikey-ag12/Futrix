import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { signAccessToken, verifyRefreshToken } from "@/lib/auth/jwt";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("futrix_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Refresh token missing" }, { status: 401 });
    }

    // Verify token payload (expiry and signature)
    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
    }

    // Check DB to ensure token exists and is not revoked
    const dbToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!dbToken || dbToken.revoked || dbToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Refresh token revoked or expired" }, { status: 401 });
    }

    // Issue a new access token
    const newAccessToken = await signAccessToken({ userId: payload.userId, email: payload.email });

    cookieStore.set("futrix_access_token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 15 * 60, // 15 mins
    });

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Refresh API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
