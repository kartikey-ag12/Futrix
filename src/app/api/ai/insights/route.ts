import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      totalRevenue = 45231.89,
      totalExpenses = 23194.00,
      netProfit = 22037.89,
      healthScore = 92,
      companyName = "Futrix Client",
    } = body;

    const apiKey = process.env.PERPLEXITY_API_KEY;

    // ── 1. If API Key is present, call Live Perplexity Model ─────────────
    if (apiKey) {
      try {
        const client = new OpenAI({
          apiKey: apiKey,
          baseURL: "https://api.perplexity.ai",
        });

        const prompt = `
Analyze the following financial summary for "${companyName}":
- Total Revenue: $${Number(totalRevenue).toLocaleString()}
- Total Expenses: $${Number(totalExpenses).toLocaleString()}
- Net Profit: $${Number(netProfit).toLocaleString()}
- Profit Margin: ${((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}%
- Health Score: ${healthScore}/100

Generate 3 concise, highly actionable financial insights.
Return a JSON object containing an "insights" key with an array of objects.
Each object in the array must have:
- "type": "warning" | "suggestion" | "opportunity"
- "title": A short 3-5 word title
- "description": A 2-sentence actionable CFO recommendation based on these numbers
`;

        const response = await client.chat.completions.create({
          model: "sonar-pro",
          messages: [
            { role: "system", content: "You are a financial AI advisor. Respond strictly with a JSON object containing an 'insights' array. Do not include markdown code blocks or other text outside the JSON." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
        });

        const content = response.choices[0]?.message?.content || "{}";
        // Clean markdown backticks if Perplexity returns them despite instructions
        const cleanContent = content.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanContent);
        const insightsList = Array.isArray(parsed)
          ? parsed
          : parsed.insights || parsed.data || parsed.results || [];

        if (insightsList.length > 0) {
          return NextResponse.json({
            status: "success",
            source: "perplexity_live",
            insights: insightsList,
          });
        }
      } catch (aiError: any) {
        console.error("Perplexity API call failed, using engine fallback:", aiError?.message);
      }
    }

    // ── 2. Rule-based Smart AI Insights (Engine Fallback) ───────────────────
    const margin = ((netProfit / (totalRevenue || 1)) * 100).toFixed(1);
    const insights = [];
    
    if (totalRevenue === 0 && totalExpenses === 0) {
      insights.push({
        type: "suggestion",
        title: "Connect Data",
        description: "Your financial data is currently empty. Wait for Xero sync to complete to generate AI insights.",
      });
    } else {
      insights.push({
        type: "suggestion",
        title: `Margin Analysis`,
        description: `Your current net profit margin is ${margin}%. Tracking this metric helps understand overall business efficiency.`,
      });
      if (netProfit < 0) {
        insights.push({
          type: "warning",
          title: "Operating Loss",
          description: `You are operating at a net loss of $${Math.abs(Number(netProfit)).toLocaleString()}. Review operating expenses to improve cash flow.`,
        });
      } else {
        insights.push({
          type: "opportunity",
          title: "Positive Cash Flow",
          description: `You have generated $${Number(netProfit).toLocaleString()} in net profit. Consider re-investing or building cash reserves.`,
        });
      }
    }

    return NextResponse.json({
      status: "success",
      source: "futrix_engine",
      insights: insights,
    });
  } catch (error: any) {
    console.error("AI Insights Error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI insights.", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST(new Request("https://futrix-lake.vercel.app/api/ai/insights", { method: "POST" }));
}
