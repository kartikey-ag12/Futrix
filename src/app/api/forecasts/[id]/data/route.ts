import { NextResponse } from "next/server";
import { ForecastService } from "@/server/forecasting/forecast.service";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const data = await ForecastService.getForecastData(id, membership.workspaceId);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to get forecast data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    // Body contains overrides map
    
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const forecast = await prisma.forecast.findUnique({ where: { id } });
    if (!forecast || forecast.workspaceId !== membership.workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const currentData = (forecast.data as any) || {};
    currentData.overrides = { ...currentData.overrides, ...body.overrides };

    const updated = await prisma.forecast.update({
      where: { id },
      data: { data: currentData }
    });

    return NextResponse.json({ success: true, updated });
  } catch (error: any) {
    console.error("Failed to update forecast data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
