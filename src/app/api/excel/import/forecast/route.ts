import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { cookies } from "next/headers";
import ExcelJS from "exceljs";
import { ForecastService } from "@/server/forecasting/forecast.service";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("futrix_access_token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyAccessToken(token);
    if (!payload?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const forecastId = formData.get("forecastId") as string;

    if (!file || !forecastId) {
      return NextResponse.json({ error: "Missing file or forecastId" }, { status: 400 });
    }

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const forecast = await prisma.forecast.findUnique({ where: { id: forecastId } });
    if (!forecast || forecast.workspaceId !== membership.workspaceId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    // To properly map names back to codes, we fetch the forecast data
    const forecastData = await ForecastService.getForecastData(forecastId, membership.workspaceId);
    
    // Create a name -> code map
    const nameToCode: Record<string, string> = {};
    Object.values(forecastData.tabs).forEach((tab: any) => {
      tab.groups.forEach((g: any) => {
        if (g.children) {
          g.children.forEach((c: any) => {
            nameToCode[c.name.trim()] = c.code;
          });
        }
      });
    });

    const overrides: Record<string, Record<string, number>> = {};
    const months = forecastData.months; // 12 strings

    workbook.eachSheet((sheet, id) => {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 6) { // skip headers
          const nameCell = row.getCell(1).text;
          const trimmedName = nameCell.trim();
          
          if (trimmedName && nameToCode[trimmedName]) {
            const code = nameToCode[trimmedName];
            if (!overrides[code]) overrides[code] = {};
            
            // Extract the 12 month columns (starting from col 2)
            months.forEach((m: string, idx: number) => {
              const valCell = row.getCell(idx + 2).value;
              const numVal = typeof valCell === 'number' ? valCell : parseFloat(String(valCell).replace(/[^0-9.-]+/g,""));
              if (!isNaN(numVal)) {
                overrides[code][m] = numVal;
              }
            });
          }
        }
      });
    });

    const currentData = (forecast.data as any) || {};
    
    // Deep merge overrides
    if (!currentData.overrides) currentData.overrides = {};
    Object.keys(overrides).forEach(code => {
      if (!currentData.overrides[code]) currentData.overrides[code] = {};
      Object.keys(overrides[code]).forEach(m => {
        currentData.overrides[code][m] = overrides[code][m];
      });
    });

    await prisma.forecast.update({
      where: { id: forecastId },
      data: { data: currentData }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Forecast excel import error:", error);
    return NextResponse.json({ error: "Failed to import excel" }, { status: 500 });
  }
}
