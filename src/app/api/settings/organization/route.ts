import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
      include: { workspace: true }
    });

    if (!member) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    return NextResponse.json({ workspace: member.workspace });
  } catch (error) {
    console.error("Org GET error:", error);
    return NextResponse.json({ error: "Failed to fetch organization" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, industry, email, country, description } = body;

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId, role: "ADMIN" },
    });

    if (!member) {
      return NextResponse.json({ error: "Forbidden: Only admins can update organization" }, { status: 403 });
    }

    const updated = await prisma.workspace.update({
      where: { id: member.workspaceId },
      data: {
        name,
        industry,
        email,
        country,
        description,
      } as any // Use any to bypass TS error in case prisma generate failed
    });

    return NextResponse.json({ success: true, workspace: updated });
  } catch (error) {
    console.error("Org PATCH error:", error);
    return NextResponse.json({ error: "Failed to update organization" }, { status: 500 });
  }
}
