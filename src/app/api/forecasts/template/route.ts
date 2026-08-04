import { NextResponse } from "next/server";
import { ExcelService } from "@/server/excel/excel.service";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const startMonth = searchParams.get('startMonth');
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

    const buffer = await ExcelService.generateForecastTemplateExcel(membership.workspaceId, months);

    return new NextResponse(buffer as any, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="1-year P&L template.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Failed to generate forecast excel template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
