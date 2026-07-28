import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("futrix_refresh_token")?.value;

    // Delete refresh token from DB if it exists
    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    // Clear all auth cookies
    cookieStore.delete("futrix_access_token");
    cookieStore.delete("futrix_refresh_token");
    cookieStore.delete("futrix_auth_token");
    cookieStore.delete("futrix_user_email");
    cookieStore.delete("futrix_user_name");
    cookieStore.delete("futrix_company_name");

    return NextResponse.json({
      status: "success",
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Failed to logout." }, { status: 500 });
  }
}
