import { NextResponse } from "next/server";
import { ExcelService, InvoiceData } from "@/server/excel/excel.service";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
});

export async function GET(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    if (!accessToken || !tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    xero.setTokenSet({ access_token: accessToken });

    // Fetch invoices from Xero
    const response = await xero.accountingApi.getInvoices(tenantId);
    const invoices = response.body.invoices || [];

    // Map to InvoiceData
    const mappedInvoices: InvoiceData[] = invoices.map(inv => ({
      contactName: inv.contact?.name || "Unknown",
      description: inv.lineItems?.[0]?.description || "No description",
      amount: inv.total || 0,
      date: inv.date || "",
      dueDate: inv.dueDate || "",
      status: inv.status?.toString()
    }));

    // Generate Excel
    const buffer = await ExcelService.generateInvoicesReport(mappedInvoices);

    // Return as downloadable file
    return new NextResponse(buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="invoices_report_${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });

  } catch (error: any) {
    console.error("Excel export error:", error);
    return NextResponse.json({ error: "Failed to export invoices to Excel" }, { status: 500 });
  }
}
