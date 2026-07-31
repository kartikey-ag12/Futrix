import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { decodeJwt } from "jose";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("futrix_refresh_token")?.value;

    // Delete refresh token from DB if it exists
    if (refreshToken) {
      try {
        const payload = decodeJwt(refreshToken);
        const userId = payload.userId as string;
        
        if (userId) {
          const userTokens = await prisma.refreshToken.findMany({
            where: { userId }
          });
          
          for (const t of userTokens) {
            const match = await bcrypt.compare(refreshToken, t.token);
            if (match) {
              await prisma.refreshToken.delete({ where: { id: t.id } });
            }
          }
        }
      } catch (err) {
        console.error("Failed to decode or delete refresh token on logout", err);
      }
    }

    // Clear all auth cookies
    cookieStore.delete("futrix_access_token");
    cookieStore.delete("futrix_refresh_token");
    cookieStore.delete("futrix_auth_token");
    cookieStore.delete("futrix_user_email");
    cookieStore.delete("futrix_user_name");
    cookieStore.delete("futrix_company_name");
    cookieStore.delete("futrix_requires_xero_onboarding");

    return NextResponse.json({
      status: "success",
      message: "Successfully logged out.",
    });
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Failed to logout." }, { status: 500 });
  }
}
