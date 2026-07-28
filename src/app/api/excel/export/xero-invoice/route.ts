import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";
import { ExcelService } from "@/server/excel/excel.service";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get("invoiceId");

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    if (!accessToken || !tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    xero.setTokenSet({ access_token: accessToken });

    // Fetch the full invoice details from Xero
    const response = await xero.accountingApi.getInvoice(tenantId, invoiceId);
    const invoice = response.body.invoices?.[0];

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found in Xero" }, { status: 404 });
    }

    // Generate a professional Excel invoice
    const buffer = await ExcelService.generateProfessionalXeroInvoice(invoice);

    const contactName = invoice.contact?.name || "Unknown";
    const invoiceNumber = invoice.invoiceNumber || invoiceId.substring(0, 8);
    const safeContactName = contactName.replace(/[\s\W]+/g, '_');

    return new NextResponse(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="invoice_${safeContactName}_${invoiceNumber}.xlsx"`,
      },
    });
  } catch (error: any) {
    console.error("Xero Excel export error:", error);
    const xeroError = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to export Xero invoice";
                   
    return NextResponse.json({ error: xeroError }, { status: 500 });
  }
}
