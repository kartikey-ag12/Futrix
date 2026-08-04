import { NextResponse } from "next/server";
import { ForecastService } from "@/server/forecasting/forecast.service";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { startMonth, method } = body;
    // startMonth is a Date string or just month/year. We will build the 12 months array.
    let startDate = new Date();
    if (startMonth) {
      startDate = new Date(startMonth);
    }
    
    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const months = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const mStr = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      months.push(mStr);
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const data = await ForecastService.generateForecastData(
      membership.workspaceId, 
      months, 
      {}, // no overrides for preview
      method || "auto"
    );

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Failed to generate forecast preview:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
