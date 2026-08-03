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

    const drivers = await prisma.driver.findMany({
      where: { workspaceId: membership.workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ drivers });
  } catch (error) {
    console.error("Failed to fetch drivers:", error);
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
    const { name, type, value, unit } = body;

    if (!name || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const driver = await prisma.driver.create({
      data: {
        workspaceId: membership.workspaceId,
        name,
        type,
        value,
        unit,
      },
    });

    return NextResponse.json({ driver });
  } catch (error) {
    console.error("Failed to create driver:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
