import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id: forecastId } = await params;
    const body = await req.json();
    const { checklistOverrides } = body;

    const forecast = await prisma.forecast.findUnique({
      where: { id: forecastId }
    });

    if (!forecast) {
      return NextResponse.json({ error: "Forecast not found" }, { status: 404 });
    }

    const currentData = (forecast.data as any) || {};
    currentData.checklistOverrides = checklistOverrides;

    await prisma.forecast.update({
      where: { id: forecastId },
      data: { data: currentData }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save checklist overrides:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
