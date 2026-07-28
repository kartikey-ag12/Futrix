import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SUPPORT_KNOWLEDGE = `
You are the official Futrix AI Support Assistant for the Futrix Financial Intelligence Platform.
Your job is to assist users with questions about using Futrix, connecting accounting software (Xero/Tally), understanding financial metrics, forecasting, reporting, billing, and team settings.

Key Futrix Info:
1. Xero Integration: Connected via secure OAuth2 in Settings or Integrations page. Historical data imports automatically.
2. Forecasting: Daily cash flow forecasts for Profit & Loss, Balance Sheet, and 90-day cash balance. Offers Base Case, Best Case (+20% revenue), and Worst Case (+15% expenses) scenario modeling.
3. Transactions: Real-time ledger entries synced from Xero. Supports client-side CSV export, search, sorting, and type filtering (Revenue vs Expense).
4. Multi-currency Consolidations: Merge multiple entities across currencies with intercompany transaction elimination.
5. Pricing Plans: Starter ($49/mo), Professional ($149/mo), Practice ($299/mo). All include a 14-day free trial without credit card required.
6. Human Support: Available 24/7 at support@futrix.com.

Be polite, clear, concise, and helpful. Use markdown formatting where useful.
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // ── 1. Call Gemini API if key is present ──────────────────────────────
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: "gemini-2.5-flash",
          systemInstruction: SUPPORT_KNOWLEDGE,
        });

        const formattedHistory = (history || []).map((h: any) => ({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }],
        }));

        const chat = model.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(message);
        const reply = result.response.text();

        return NextResponse.json({
          status: "success",
          reply,
          source: "gemini_live",
        });
      } catch (err: any) {
        console.error("Support Chat Gemini Error:", err?.message);
      }
    }

    // ── 2. Knowledge-based Intelligent Support Fallback ────────────────────
    const lower = message.toLowerCase();
    let reply = "Thanks for asking! As your Futrix AI Support Assistant, I'm here to help you get the most out of your financial intelligence platform. How can I assist you with forecasting, Xero sync, or reporting today?";

    if (lower.includes("xero") || lower.includes("connect")) {
      reply = "To connect **Xero**, navigate to **Settings → Integrations** or click the **Connect** banner on the main Dashboard. You'll be redirected to Xero's secure OAuth2 sign-in page. No passwords are stored on Futrix!";
    } else if (lower.includes("forecast") || lower.includes("runway") || lower.includes("scenario")) {
      reply = "Futrix calculates **90-Day Cash Flow Forecasts** using your actual invoice payment velocity. On the **Forecasting** page, you can switch between **Base Case**, **Best Case (+20% Revenue)**, and **Worst Case (+15% Expenses)** scenarios.";
    } else if (lower.includes("export") || lower.includes("csv") || lower.includes("excel")) {
      reply = "You can export all transactions to CSV anytime! Go to the **Transactions** page and click the **Export CSV** button in the top right corner.";
    } else if (lower.includes("price") || lower.includes("plan") || lower.includes("trial") || lower.includes("billing")) {
      reply = "Futrix offers 3 flexible plans: **Starter ($49/mo)**, **Professional ($149/mo)**, and **Practice ($299/mo)**. Annual billing saves 20%. All plans start with a 14-day free trial with no credit card required.";
    } else if (lower.includes("team") || lower.includes("invite") || lower.includes("user")) {
      reply = "To invite team members, go to **Settings → Team Members** and click **Invite Member**. You can assign roles such as *Owner*, *Admin*, or *Viewer*.";
    }

    return NextResponse.json({
      status: "success",
      reply,
      source: "futrix_knowledge_engine",
    });
  } catch (error: any) {
    console.error("Support API Error:", error);
    return NextResponse.json({ error: "Failed to process chat message." }, { status: 500 });
  }
}
