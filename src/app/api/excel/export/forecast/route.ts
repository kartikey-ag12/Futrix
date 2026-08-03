import { NextResponse } from "next/server";
import { ExcelService } from "@/server/excel/excel.service";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing forecast id" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const forecast = await prisma.forecast.findUnique({ where: { id } });
    if (!forecast || forecast.workspaceId !== membership.workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = await ExcelService.generateForecastExcel(forecast);

    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="forecast_${forecast.name.replace(/\s+/g, '_')}_export.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Excel forecast export error:", error);
    return NextResponse.json({ error: "Failed to export forecast to Excel" }, { status: 500 });
  }
}
