import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";
import * as ExcelJS from "exceljs";

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

    const workspace = await prisma.workspace.findUnique({
      where: { id: membership.workspaceId },
    });

    const drivers = await prisma.driver.findMany({
      where: { workspaceId: membership.workspaceId },
      orderBy: { createdAt: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Drivers");


    // Set column widths
    worksheet.columns = [
      { width: 25 }, // A
      { width: 35 }, // B
      { width: 20 }, // C
      { width: 20 }, // D
      { width: 15 }, // E
      { width: 15 }, // F
      { width: 15 }, // G
      { width: 15 }, // H
      { width: 15 }, // I
      { width: 15 }, // J
    ];

    // Light yellow fill
    const yellowFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFF2CC' }, // light yellow
    };

    // Light green fill
    const greenFill: ExcelJS.Fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE2EFDA' }, // light green
    };
    
    // Border style
    const borderStyle: Partial<ExcelJS.Borders> = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };

    const headerFont: Partial<ExcelJS.Font> = {
      bold: true,
      size: 11,
      name: 'Arial'
    };

    // Row 1
    worksheet.getCell('A1').value = 'Import type';
    worksheet.getCell('B1').value = 'Drivers';
    worksheet.getCell('B1').font = { bold: true };

    // Row 2
    worksheet.getCell('A2').value = 'Organisation name';
    worksheet.getCell('B2').value = workspace?.name ? `${workspace.name} (Global)` : 'Demo Company (Global)';
    worksheet.getCell('B2').font = { bold: true };

    // Row 3
    worksheet.getCell('A3').value = 'Start date';
    worksheet.getCell('B3').value = '';
    // Apply white background and borders to B3
    worksheet.getCell('B3').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    worksheet.getCell('B3').border = borderStyle;

    // Row 4
    worksheet.getCell('A4').value = 'End date';
    worksheet.getCell('B4').value = '';
    worksheet.getCell('B4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } };
    worksheet.getCell('B4').border = borderStyle;

    // Apply yellow fill to A1:D4 (excluding B3:B4 which we already set)
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 4; c++) {
        if ((r === 3 && c === 2) || (r === 4 && c === 2)) continue;
        worksheet.getCell(r, c).fill = yellowFill;
      }
    }

    // Merge E1:J4
    worksheet.mergeCells('E1:J4');
    const infoCell = worksheet.getCell('E1');
    infoCell.value = 'Click here for a step-by-step guide on this template.\nSet the date range in cells B3 and B4.';
    infoCell.font = { bold: true };
    infoCell.fill = yellowFill;
    infoCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };

    // Row 5: Headers
    worksheet.getCell('A5').value = 'Driver group name';
    worksheet.getCell('B5').value = 'Driver name';
    worksheet.getCell('C5').value = 'Store on';
    worksheet.getCell('D5').value = 'Decimal display';
    
    for (let c = 1; c <= 4; c++) {
      const cell = worksheet.getCell(5, c);
      cell.font = headerFont;
      cell.fill = greenFill;
      cell.border = borderStyle;
    }

    // Row 6: Subheaders
    worksheet.getCell('A6').value = '(Optional)';
    worksheet.getCell('B6').value = '(Required)';
    worksheet.getCell('C6').value = '(Blank = 1st day of month)';
    worksheet.getCell('D6').value = '(Default = 0.00)';
    
    for (let c = 1; c <= 4; c++) {
      const cell = worksheet.getCell(6, c);
      cell.font = { italic: true, size: 10, name: 'Arial' };
      cell.fill = greenFill;
      cell.border = borderStyle;
    }

    // Add borders to the date columns header (E5:J5, E6:J6) - keep them empty for now but format them
    for (let c = 5; c <= 10; c++) {
      worksheet.getCell(5, c).border = borderStyle;
      worksheet.getCell(5, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } }; // gray border fill
      worksheet.getCell(6, c).border = borderStyle;
      worksheet.getCell(6, c).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
    }

    // Add Driver Data
    let currentRow = 7;
    for (const driver of drivers) {
      worksheet.getCell(`A${currentRow}`).value = driver.type || '';
      worksheet.getCell(`B${currentRow}`).value = driver.name || '';
      worksheet.getCell(`C${currentRow}`).value = '';
      worksheet.getCell(`D${currentRow}`).value = '0.00';
      
      // Add borders for data cells
      for(let c = 1; c <= 10; c++) {
          worksheet.getCell(currentRow, c).border = {
              left: {style: 'thin', color: {argb: 'FFBFBFBF'}},
              right: {style: 'thin', color: {argb: 'FFBFBFBF'}},
              top: {style: 'thin', color: {argb: 'FFBFBFBF'}},
              bottom: {style: 'thin', color: {argb: 'FFBFBFBF'}},
          };
      }
      currentRow++;
    }
    

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="Drivers_Template.xlsx"',
      },
    });
  } catch (error) {
    console.error("Failed to generate template:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
