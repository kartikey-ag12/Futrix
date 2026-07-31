import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';
import { prisma } from '@/lib/prisma';

const scopes = 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' ');

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes,
});

export async function GET() {
  try {
    // Identify the calling user from their JWT so we can scope the Xero
    // connection to the correct workspace in the callback.
    const cookieStore = await cookies();
    const token = cookieStore.get('futrix_access_token')?.value;

    let workspaceId: string | null = null;

    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload?.userId) {
        // Look up the user's primary workspace (ADMIN role first)
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId: payload.userId },
          orderBy: { role: 'asc' }, // ADMIN < MEMBER alphabetically
          select: { workspaceId: true },
        });
        workspaceId = membership?.workspaceId ?? null;
      }
    }

    // Encode workspaceId + userId in Xero's state param (base64 JSON).
    // Callback will decode this to know which workspace to save tokens to.
    // Also include a csrf nonce using crypto.randomUUID().
    const statePayload = JSON.stringify({
      workspaceId,
      // Include the JWT userId so callback can also clear requiresXeroOnboarding
      userId: token ? (await verifyAccessToken(token))?.userId : null,
      nonce: crypto.randomUUID(),
    });
    const stateB64 = Buffer.from(statePayload).toString('base64url');

    // xero-node's buildConsentUrl() passes through a state param via internal config.
    // We'll append it manually to the redirect URL since xero-node handles it differently.
    const consentUrl = await xero.buildConsentUrl();
    const consentWithState = new URL(consentUrl);
    consentWithState.searchParams.set('state', stateB64);

    return NextResponse.redirect(consentWithState.toString());
  } catch (error) {
    console.error("Error generating Xero consent URL:", error);
    return NextResponse.json({ error: 'Failed to generate consent URL' }, { status: 500 });
  }
}
