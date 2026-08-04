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
    const monthsStr = formData.get("months") as string;
    const method = (formData.get("method") as string) || "scratch";

    if (!file || !monthsStr) {
      return NextResponse.json({ error: "Missing file or months" }, { status: 400 });
    }

    const months = JSON.parse(monthsStr);

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: payload.userId },
    });
    if (!membership) return NextResponse.json({ error: "No workspace" }, { status: 403 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer as any);

    // To properly map names back to codes, we fetch the preview data structure
    const forecastData = await ForecastService.generateForecastData(membership.workspaceId, months, {}, method as any);
    
    // Create a code -> code map to verify, since our template uses Account Code in column A
    const codeMap: Record<string, string> = {};
    Object.values(forecastData.tabs).forEach((tab: any) => {
      tab.groups.forEach((g: any) => {
        if (g.children) {
          g.children.forEach((c: any) => {
            codeMap[c.code] = c.code;
          });
        }
      });
    });

    const overrides: Record<string, Record<string, number>> = {};

    workbook.eachSheet((sheet, id) => {
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 6) { // skip headers
          // Col 1 is Account Code, Col 2 is Name, Col 3+ are months
          const codeCell = row.getCell(1).text;
          const trimmedCode = codeCell.trim();
          
          if (trimmedCode && codeMap[trimmedCode]) {
            const code = codeMap[trimmedCode];
            if (!overrides[code]) overrides[code] = {};
            
            // Extract the 12 month columns (starting from col 3)
            months.forEach((m: string, idx: number) => {
              const valCell = row.getCell(idx + 3).value;
              let numVal = 0;
              if (typeof valCell === 'number') {
                numVal = valCell;
              } else if (typeof valCell === 'string') {
                numVal = parseFloat(String(valCell).replace(/[^0-9.-]+/g,""));
              } else if (valCell && typeof valCell === 'object' && 'result' in valCell) {
                numVal = parseFloat(String(valCell.result).replace(/[^0-9.-]+/g,""));
              }

              if (!isNaN(numVal) && numVal !== 0 && valCell !== null) {
                overrides[code][m] = numVal;
              }
            });
          }
        }
      });
    });

    return NextResponse.json({ overrides });
  } catch (error: any) {
    console.error("Forecast preview excel import error:", error);
    return NextResponse.json({ error: "Failed to import excel" }, { status: 500 });
  }
}
