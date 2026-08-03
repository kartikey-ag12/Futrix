import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
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

    const reports = await prisma.report.findMany({
      where: { workspaceId: membership.workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

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
    const { name, type, status, pageCount, data } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const report = await prisma.report.create({
      data: {
        workspaceId: membership.workspaceId,
        name,
        type,
        status: status || 'draft',
        pageCount: pageCount || 1,
        data: data || {},
      },
    });

    return NextResponse.json({ report });
  } catch (error) {
    console.error("Failed to create report:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
