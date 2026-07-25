import { NextResponse } from "next/server";
import { XeroClient, Invoice } from "xero-node";
import { cookies } from "next/headers";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { contactName, description, amount, date } = body;

    const cookieStore = await cookies();
    const accessToken = cookieStore.get('xero_access_token')?.value;
    const tenantId = cookieStore.get('xero_tenant_id')?.value;

    if (!accessToken || !tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    xero.setTokenSet({ access_token: accessToken });

    // Step 1: Check if the contact exists, or create them.
    // To keep the quick-create simple, we'll try to find them, or just use their name directly if Xero allows it on a new invoice.
    // Usually Xero requires a Contact with a Name to create an invoice.
    
    const newInvoice: Invoice = {
      type: Invoice.TypeEnum.ACCREC,
      contact: {
        name: contactName
      },
      date: date || new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
      lineItems: [
        {
          description: description,
          quantity: 1,
          unitAmount: parseFloat(amount),
          accountCode: "200" // Standard Revenue Account code in Xero Demo Company
        }
      ],
      status: Invoice.StatusEnum.DRAFT
    };

    const invoices = { invoices: [newInvoice] };

    const response = await xero.accountingApi.createInvoices(tenantId, invoices);
    
    return NextResponse.json({
      status: "success",
      message: "Invoice created successfully in Xero",
      data: response.body.invoices?.[0]
    });

  } catch (error: any) {
    console.error("Xero create invoice error:", error);
    // Xero errors are nested in error.response.body or error.body
    const xeroError = error.response?.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.body?.Elements?.[0]?.ValidationErrors?.[0]?.Message 
                   || error.message 
                   || "Failed to create invoice in Xero";
                   
    return NextResponse.json({ error: xeroError }, { status: 500 });
  }
}
