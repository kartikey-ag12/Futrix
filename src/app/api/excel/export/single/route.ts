import { NextResponse } from "next/server";
import { ExcelService, InvoiceData } from "@/server/excel/excel.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const invoiceData: InvoiceData = {
      contactName: body.contactName || "Unknown",
      description: body.description || "No description",
      amount: parseFloat(body.amount) || 0,
      date: body.date || new Date().toISOString().split('T')[0],
      dueDate: body.dueDate || "",
      status: body.status || "DRAFT",
    };

    const buffer = await ExcelService.generateInvoiceExcel(invoiceData);

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="invoice_${body.contactName?.replace(/\s+/g, '_') || 'download'}_${invoiceData.date}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Excel single export error:", error);
    return NextResponse.json({ error: "Failed to export invoice to Excel" }, { status: 500 });
  }
}
