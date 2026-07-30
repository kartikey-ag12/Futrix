import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

// Helper to authenticate request and get the admin workspace member
async function authenticateAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("futrix_access_token")?.value;
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  const member = await prisma.workspaceMember.findFirst({
    where: { userId: payload.userId, role: "ADMIN" },
  });
  return member;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyAccessToken(token);
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const member = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });

    if (!member) return NextResponse.json({ error: "No workspace" }, { status: 404 });

    const team = await prisma.workspaceMember.findMany({
      where: { workspaceId: member.workspaceId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({ team });
  } catch (error) {
    console.error("Team GET error:", error);
    return NextResponse.json({ error: "Failed to fetch team" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const adminMember = await authenticateAdmin();
    if (!adminMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { email, role, name } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    // Find or create user
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split("@")[0],
          // In a real app we'd send an email invite. Here we just create a stub.
          passwordHash: "INVITED_NO_PASSWORD", 
        }
      });
    }

    // Check if already in workspace
    const existing = await prisma.workspaceMember.findFirst({
      where: { userId: user.id, workspaceId: adminMember.workspaceId }
    });
    if (existing) {
      return NextResponse.json({ error: "User already in team" }, { status: 400 });
    }

    const newMember = await prisma.workspaceMember.create({
      data: {
        userId: user.id,
        workspaceId: adminMember.workspaceId,
        role: role || "MEMBER",
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({ success: true, member: newMember });
  } catch (error) {
    console.error("Team POST error:", error);
    return NextResponse.json({ error: "Failed to invite member" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const adminMember = await authenticateAdmin();
    if (!adminMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { memberId, role } = await req.json(); // memberId is workspaceMember.id
    if (!memberId || !role) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // Verify member is in the same workspace
    const targetMember = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.workspaceId !== adminMember.workspaceId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: memberId },
      data: { role },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({ success: true, member: updated });
  } catch (error) {
    console.error("Team PATCH error:", error);
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const adminMember = await authenticateAdmin();
    if (!adminMember) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId");
    if (!memberId) return NextResponse.json({ error: "Missing memberId" }, { status: 400 });

    const targetMember = await prisma.workspaceMember.findUnique({ where: { id: memberId } });
    if (!targetMember || targetMember.workspaceId !== adminMember.workspaceId) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    if (targetMember.userId === adminMember.userId) {
      return NextResponse.json({ error: "Cannot remove yourself" }, { status: 400 });
    }

    await prisma.workspaceMember.delete({ where: { id: memberId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Team DELETE error:", error);
    return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
  }
}
