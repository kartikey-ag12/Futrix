import { NextResponse } from "next/server";
import { ExcelService } from "@/server/excel/excel.service";
import { XeroClient, Invoice } from "xero-node";
import { cookies } from "next/headers";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    if (!accessToken || !tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    xero.setTokenSet({ access_token: accessToken });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse Excel file
    const invoicesData = await ExcelService.parseInvoicesExcel(buffer);

    if (invoicesData.length === 0) {
      return NextResponse.json({ error: "No valid invoices found in Excel file" }, { status: 400 });
    }

    // Prepare for Xero
    const xeroInvoices: Invoice[] = invoicesData.map(inv => ({
      type: Invoice.TypeEnum.ACCREC,
      contact: {
        name: inv.contactName
      },
      date: inv.date,
      dueDate: inv.dueDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lineItems: [
        {
          description: inv.description,
          quantity: 1,
          unitAmount: inv.amount,
          accountCode: "200"
        }
      ],
      status: Invoice.StatusEnum.DRAFT
    }));

    // Send to Xero
    const invoicesPayload = { invoices: xeroInvoices };
    const response = await xero.accountingApi.createInvoices(tenantId, invoicesPayload);

    return NextResponse.json({
      status: "success",
      message: `Successfully imported ${response.body.invoices?.length || 0} invoices to Xero.`,
      count: response.body.invoices?.length || 0
    });

  } catch (error: any) {
    console.error("Excel import error:", error);
    const errorMessage = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to import invoices from Excel";
                   
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
