import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || "",
  clientSecret: process.env.XERO_CLIENT_SECRET || "",
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ValidationResult {
  status: "PASS" | "WARN" | "FAIL";
  qualityScore: number;
  criticalIssues: string[];
  warnings: string[];
  recommendations: string[];
  degraded?: boolean; // true when Gemini was skipped due to API failure
}

// ---------------------------------------------------------------------------
// Deterministic validation – runs locally, zero latency
// ---------------------------------------------------------------------------

function runDeterministicChecks(invoice: any): { pass: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!invoice.invoiceNumber) errors.push("Invoice number is missing.");
  if (!invoice.contact?.name) errors.push("Customer name is missing.");
  if (!invoice.date) errors.push("Invoice date is missing.");
  if (!invoice.dueDate) errors.push("Due date is missing.");
  if (!invoice.currencyCode) errors.push("Currency is missing.");
  if (!invoice.status) errors.push("Invoice status is missing.");

  const items: any[] = invoice.lineItems || [];
  if (items.length === 0) {
    errors.push("Invoice has no line items.");
  } else {
    items.forEach((item, i) => {
      if (!item.quantity || item.quantity <= 0)
        errors.push(`Line item ${i + 1}: quantity must be greater than 0.`);
      if (!item.unitAmount || item.unitAmount <= 0)
        errors.push(`Line item ${i + 1}: unit price must be greater than 0.`);
    });
  }

  if (!invoice.total || invoice.total <= 0) errors.push("Total amount must be greater than 0.");

  // Math check: subTotal + totalTax ≈ total (allow ±0.02 for rounding)
  if (invoice.subTotal != null && invoice.totalTax != null && invoice.total != null) {
    const expected = Number(invoice.subTotal) + Number(invoice.totalTax);
    const actual = Number(invoice.total);
    if (Math.abs(expected - actual) > 0.02) {
      errors.push(
        `Total mismatch: Subtotal (${invoice.subTotal}) + Tax (${invoice.totalTax}) = ${expected.toFixed(2)}, but Total is ${actual}.`
      );
    }
  }

  return { pass: errors.length === 0, errors };
}

// ---------------------------------------------------------------------------
// Gemini 2.5 Flash validation
// ---------------------------------------------------------------------------

const GEMINI_PROMPT_TEMPLATE = (invoiceJson: string) => `
You are an Enterprise Invoice Validation AI.
You are NOT an invoice generator.
You are NOT allowed to change values.
You are NOT allowed to calculate taxes.
Only review the invoice quality.

Review the following invoice JSON and verify:

## Customer
- Customer Name
- Customer Address
- Customer Email
- Customer GST/VAT (if applicable)

## Company
- Company Name
- Company Address
- GST/VAT
- Bank Details

## Invoice
- Invoice Number
- Reference
- Invoice Date
- Due Date
- Currency
- Status

## Items
- Description clarity
- Duplicate rows
- Missing quantity
- Missing prices
- Missing tax labels

## Formatting
- Professional structure
- Missing sections
- Missing notes
- Missing payment terms

## Invoice JSON
${invoiceJson}

Return ONLY valid JSON in this exact format:
{
  "status": "PASS",
  "qualityScore": 97,
  "criticalIssues": [],
  "warnings": ["Reference number is empty."],
  "recommendations": ["Include payment terms.", "Include customer address."]
}

Do not return markdown. Do not explain anything. Return JSON only.
`;

async function callGemini(invoice: any): Promise<ValidationResult | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("[AI Validation] GEMINI_API_KEY is not set – skipping AI validation.");
    return null;
  }

  // Sanitize invoice to reduce token usage – keep only relevant fields
  const slim = {
    invoiceNumber: invoice.invoiceNumber,
    reference: invoice.reference,
    status: invoice.status,
    date: invoice.date,
    dueDate: invoice.dueDate,
    currencyCode: invoice.currencyCode,
    lineAmountTypes: invoice.lineAmountTypes,
    subTotal: invoice.subTotal,
    totalTax: invoice.totalTax,
    total: invoice.total,
    contact: {
      name: invoice.contact?.name,
      emailAddress: invoice.contact?.emailAddress,
      addresses: invoice.contact?.addresses,
    },
    lineItems: (invoice.lineItems || []).map((item: any) => ({
      description: item.description,
      quantity: item.quantity,
      unitAmount: item.unitAmount,
      taxType: item.taxType,
      taxAmount: item.taxAmount,
      lineAmount: item.lineAmount,
      accountCode: item.accountCode,
    })),
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ parts: [{ text: GEMINI_PROMPT_TEMPLATE(JSON.stringify(slim, null, 2)) }] }],
    generationConfig: { responseMimeType: "application/json" },
  };

  const attempt = async (): Promise<ValidationResult | null> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text();
        console.error("[AI Validation] Gemini API error:", errText);
        return null;
      }

      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!rawText) {
        console.error("[AI Validation] Empty response from Gemini.");
        return null;
      }

      // Strip any accidental markdown code fences
      const clean = rawText.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean) as ValidationResult;
      return parsed;
    } catch (err: any) {
      clearTimeout(timeout);
      if (err.name === "AbortError") {
        console.warn("[AI Validation] Gemini request timed out.");
      } else {
        console.error("[AI Validation] Gemini fetch error:", err.message);
      }
      return null;
    }
  };

  // Try once, then retry once
  let result = await attempt();
  if (!result) {
    console.warn("[AI Validation] Retrying Gemini request...");
    result = await attempt();
  }

  return result;
}

// ---------------------------------------------------------------------------
// Map qualityScore to status string for the modal
// ---------------------------------------------------------------------------

function deriveStatus(score: number): "PASS" | "WARN" | "FAIL" {
  if (score >= 90) return "PASS";
  if (score >= 70) return "WARN";
  return "FAIL";
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: "Missing invoiceId" }, { status: 400 });
    }

    // 1. Fetch invoice from Xero
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("xero_access_token")?.value;
    const tenantId = cookieStore.get("xero_tenant_id")?.value;

    if (!accessToken || !tenantId) {
      return NextResponse.json({ error: "Not authenticated with Xero" }, { status: 401 });
    }

    xero.setTokenSet({ access_token: accessToken });

    const response = await xero.accountingApi.getInvoice(tenantId, invoiceId);
    const invoice = response.body.invoices?.[0];

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found in Xero" }, { status: 404 });
    }

    // 2. Deterministic validation
    const { pass, errors } = runDeterministicChecks(invoice);

    if (!pass) {
      return NextResponse.json(
        {
          status: "FAIL",
          qualityScore: 0,
          criticalIssues: errors,
          warnings: [],
          recommendations: ["Fix the critical issues listed above before attempting to download."],
          degraded: false,
        } satisfies ValidationResult,
        { status: 200 }
      );
    }

    // 3. AI validation (Gemini 2.5 Flash)
    const aiResult = await callGemini(invoice);

    if (!aiResult) {
      // Gemini unavailable – degrade gracefully, allow download
      return NextResponse.json(
        {
          status: "PASS",
          qualityScore: 90,
          criticalIssues: [],
          warnings: ["AI validation was skipped because the Gemini API is unavailable. Deterministic checks passed."],
          recommendations: [],
          degraded: true,
        } satisfies ValidationResult,
        { status: 200 }
      );
    }

    // Normalise status from score
    aiResult.status = deriveStatus(aiResult.qualityScore);

    return NextResponse.json(aiResult, { status: 200 });
  } catch (error: any) {
    console.error("[AI Validation] Unexpected error:", error);
    return NextResponse.json({ error: error.message || "Validation failed" }, { status: 500 });
  }
}
