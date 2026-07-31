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
    const cookieStore = await cookies();
    const token = cookieStore.get('futrix_access_token')?.value;

    let workspaceId: string | null = null;

    if (token) {
      const payload = await verifyAccessToken(token);
      if (payload?.userId) {
        const membership = await prisma.workspaceMember.findFirst({
          where: { userId: payload.userId },
          orderBy: { role: 'asc' },
          select: { workspaceId: true },
        });
        workspaceId = membership?.workspaceId ?? null;
      }
    }

    // Instead of overriding the OAuth state parameter (which breaks xero-node's
    // internal state verification in openid-client), we store the workspace context
    // in a temporary cookie to be read by the callback.
    const statePayload = JSON.stringify({
      workspaceId,
      userId: token ? (await verifyAccessToken(token))?.userId : null,
    });
    
    // Set this cookie so the callback knows which workspace to associate tokens with
    cookieStore.set('futrix_xero_connect_context', statePayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 15 * 60, // 15 mins
    });

    const consentUrl = await xero.buildConsentUrl();
    return NextResponse.redirect(consentUrl);
  } catch (error) {
    console.error("Error generating Xero consent URL:", error);
    return NextResponse.json({ error: 'Failed to generate consent URL' }, { status: 500 });
  }
}
