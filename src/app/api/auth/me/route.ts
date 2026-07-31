import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const payload = await verifyAccessToken(token);
    
    if (!payload) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        requiresXeroOnboarding: true,
        // Fetch the user's primary workspace (first ADMIN membership)
        workspaces: {
          select: { workspaceId: true, role: true },
          orderBy: { role: "asc" }, // ADMIN < MEMBER alphabetically
          take: 1,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    const primaryWorkspaceId = user.workspaces[0]?.workspaceId ?? null;

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        name: user.name || user.email?.split("@")[0] || "Futrix User",
        email: user.email,
        role: user.role,
        requiresXeroOnboarding: user.requiresXeroOnboarding,
        workspaceId: primaryWorkspaceId,
      },
    });
  } catch (error) {
    console.error("Auth me endpoint error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
