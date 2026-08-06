import { NextResponse } from "next/server";
import { XeroClient } from "xero-node";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { prisma } from "@/lib/prisma";

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'https://futrix-lake.vercel.app/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

export async function GET(req: Request) {
  try {
    // ── 1. Authenticate the calling user ─────────────────────────────────────
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;
    const refreshToken = cookieStore.get('futrix_refresh_token')?.value;

    let jwtPayload = null;
    if (jwtToken) {
      jwtPayload = await verifyAccessToken(jwtToken);
    }
    if (!jwtPayload && refreshToken) {
      const { verifyRefreshToken } = await import("@/lib/auth/jwt");
      jwtPayload = await verifyRefreshToken(refreshToken);
    }
    if (!jwtPayload?.userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // ── 2. Find the user's workspace ─────────────────────────────────────────
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: jwtPayload.userId },
      orderBy: { role: 'asc' },
      select: { workspaceId: true },
    });
    if (!membership) {
      return NextResponse.json({ error: "No workspace found" }, { status: 404 });
    }
    const workspaceId = membership.workspaceId;

    // ── 3. Fetch Integration record ──────────────────────────────────────────
    let integration = await prisma.integration.findUnique({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
    });
    if (!integration?.accessToken || !integration?.tenantId) {
      return NextResponse.json({ assets: [], liabilities: [], isDemo: true });
    }

    // ── 4. Refresh token if expired ──────────────────────────────────────────
    const nowSeconds = Math.floor(Date.now() / 1000);
    const isExpired = integration.expiresAt ? integration.expiresAt <= nowSeconds : true;
    await xero.initialize();
    if (isExpired && integration.refreshToken) {
      try {
        xero.setTokenSet({
          access_token: integration.accessToken,
          refresh_token: integration.refreshToken,
        });
        const newTokenSet = await xero.refreshToken();
        const newExpiry = newTokenSet.expires_at ? Number(newTokenSet.expires_at) : Math.floor(Date.now() / 1000) + 1800;
        integration = await prisma.integration.update({
          where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
          data: {
            accessToken: newTokenSet.access_token ?? integration.accessToken,
            refreshToken: newTokenSet.refresh_token ?? integration.refreshToken,
            expiresAt: newExpiry,
          },
        });
      } catch (refreshErr) {
        console.error("Xero token refresh failed:", refreshErr);
      }
    }

    // ── 5. Call Xero API for Balance Sheet ─────────────────────────
    xero.setTokenSet({ access_token: integration.accessToken! });
    const tenantId = integration.tenantId!;

    let balanceSheetResponse: any;
    try {
        balanceSheetResponse = await xero.accountingApi.getReportBalanceSheet(tenantId);
    } catch (err: any) {
        console.warn("Could not fetch Balance Sheet:", err.message);
        return NextResponse.json({ assets: [], liabilities: [], isDemo: true });
    }

    const report = balanceSheetResponse?.body?.reports?.[0];
    const { assets, liabilities } = parseBalanceSheet(report);

    return NextResponse.json({ assets, liabilities, isDemo: false });
  } catch (error: any) {
    console.error("Balance sheet error:", error);
    return NextResponse.json({ error: "Failed to fetch balance sheet" }, { status: 500 });
  }
}

function parseBalanceSheet(report: any) {
  let parsedAssets: any[] = [];
  let parsedLiabilities: any[] = [];
  
  if (report && report.rows) {
      let totalAssetsVal = 0;
      let totalLiabilitiesVal = 0;
      report.rows.forEach((row: any) => {
        if (row.rowType === 'Section' && row.title === 'Assets') {
           totalAssetsVal = row.rows?.find((r:any) => r.rowType === 'SummaryRow')?.cells?.[0]?.value || 0;
           if (totalAssetsVal !== 0) parsedAssets.push({ name: 'Total Assets', value: totalAssetsVal, trend: 0 });
        }
        if (row.rowType === 'Section' && row.title === 'Liabilities') {
           totalLiabilitiesVal = row.rows?.find((r:any) => r.rowType === 'SummaryRow')?.cells?.[0]?.value || 0;
           if (totalLiabilitiesVal !== 0) parsedLiabilities.push({ name: 'Total Liabilities', value: totalLiabilitiesVal, trend: 0 });
        }
      });
  }
  return { assets: parsedAssets, liabilities: parsedLiabilities };
}
