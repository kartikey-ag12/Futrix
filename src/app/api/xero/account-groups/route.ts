import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const body = await req.json();
    const { name, accountIds } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const group = await prisma.accountGroup.create({
      data: {
        workspaceId: membership.workspaceId,
        name,
        accountIds: accountIds || [],
      },
    });

    return NextResponse.json({ status: "success", group });
  } catch (error) {
    console.error("Failed to create account group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });

    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }

    const body = await req.json();
    const { id, name, accountIds } = body;

    if (!id) {
      return NextResponse.json({ error: "Group ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existingGroup = await prisma.accountGroup.findUnique({
      where: { id },
    });

    if (!existingGroup || existingGroup.workspaceId !== membership.workspaceId) {
      return NextResponse.json({ error: "Group not found or unauthorized" }, { status: 404 });
    }

    const updatedGroup = await prisma.accountGroup.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingGroup.name,
        accountIds: accountIds !== undefined ? accountIds : existingGroup.accountIds,
      },
    });

    return NextResponse.json({ status: "success", group: updatedGroup });
  } catch (error) {
    console.error("Failed to update account group:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
