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

    const forecasts = await prisma.forecast.findMany({
      where: { workspaceId: membership.workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ forecasts });
  } catch (error) {
    console.error("Failed to fetch forecasts:", error);
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
    const { name, type, method, months, overrides } = body;

    const forecast = await prisma.forecast.create({
      data: {
        workspaceId: membership.workspaceId,
        name: name || "New Forecast",
        type: type || "1yr-pl",
        status: "draft",
        data: {
          method: method || "auto",
          months: months,
          overrides: overrides || {},
        }
      }
    });

    return NextResponse.json(forecast);
  } catch (error) {
    console.error("Failed to create forecast:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
