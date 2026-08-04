import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth/jwt';

const scopes = 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' ');

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  let wasOnboarding = false;

  try {
    // ── 1. Identify the authenticated user ─────────────────────────────────
    const cookieStore = await cookies();
    const jwtToken = cookieStore.get('futrix_access_token')?.value;

    if (!jwtToken) {
      return NextResponse.redirect(new URL('/login?error=session_expired', req.url));
    }

    const jwtPayload = await verifyAccessToken(jwtToken);
    if (!jwtPayload?.userId) {
      return NextResponse.redirect(new URL('/login?error=session_expired', req.url));
    }

    // ── 2. Decode workspace context from our custom cookie ─────────────────
    let stateWorkspaceId: string | null = null;
    const contextCookie = cookieStore.get('futrix_xero_connect_context')?.value;
    
    if (contextCookie) {
      try {
        const decoded = JSON.parse(contextCookie);
        stateWorkspaceId = decoded.workspaceId ?? null;
        wasOnboarding = !stateWorkspaceId; // No workspaceId means they were in onboarding flow
      } catch {
        // parsing failed
      }
      cookieStore.delete('futrix_xero_connect_context');
    }

    // ── 3. Exchange auth code for tokens ────────────────────────────────────
    const tokenSet = await xero.apiCallback(url.toString());

    // ── 4. Fetch connected tenants from Xero ────────────────────────────────
    await xero.updateTenants();
    const activeTenant = xero.tenants[0];

    if (!activeTenant) {
      throw new Error('No active Xero tenant found after OAuth.');
    }

    const accessToken = tokenSet.access_token ?? '';
    const refreshToken = tokenSet.refresh_token ?? '';
    // expiresAt: Xero tokens typically expire in 30 minutes
    const expiresAt = tokenSet.expires_at
      ? Number(tokenSet.expires_at)
      : Math.floor(Date.now() / 1000) + 1800;

    const orgName: string = activeTenant.tenantName || activeTenant.tenantId;

    // ── 5. Resolve or create the user's Workspace ───────────────────────────
    // Determine workspaceId: prefer state param, fall back to DB lookup
    let workspaceId = stateWorkspaceId;

    if (!workspaceId) {
      // Existing user reconnecting — find their primary workspace
      const membership = await prisma.workspaceMember.findFirst({
        where: { userId: jwtPayload.userId },
        orderBy: { role: 'asc' },
        select: { workspaceId: true },
      });
      workspaceId = membership?.workspaceId ?? null;
    }

    // For new users (requiresXeroOnboarding === true), there's no workspace yet.
    // Auto-create one using the real Xero org name.
    if (!workspaceId) {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.userId },
        select: { requiresXeroOnboarding: true },
      });

      if (user?.requiresXeroOnboarding) {
        // Create workspace + make user ADMIN — all within a transaction
        const result = await prisma.$transaction(async (tx) => {
          const ws = await tx.workspace.create({
            data: { name: orgName },
          });
          await tx.workspaceMember.create({
            data: {
              userId: jwtPayload.userId,
              workspaceId: ws.id,
              role: 'ADMIN',
            },
          });
          return ws;
        });
        workspaceId = result.id;
      }
    }

    if (!workspaceId) {
      throw new Error('Could not resolve workspaceId for Xero integration.');
    }

    // ── 6. UPSERT Integration record in DB (NOT cookies) ────────────────────
    // Tokens are stored in the Integration table, scoped per workspace.
    // NEVER stored in cookies — this is a security fix.
    await prisma.integration.upsert({
      where: { workspaceId_provider: { workspaceId, provider: 'xero' } },
      create: {
        workspaceId,
        provider: 'xero',
        accessToken,
        refreshToken,
        tenantId: activeTenant.tenantId,
        expiresAt,
      },
      update: {
        accessToken,
        refreshToken,
        tenantId: activeTenant.tenantId,
        expiresAt,
      },
    });

    // ── 7. Clear the onboarding gate for this user ──────────────────────────
    // After a successful Xero connection, the user no longer needs onboarding.
    await prisma.user.update({
      where: { id: jwtPayload.userId },
      data: { requiresXeroOnboarding: false },
    });

    // ── 8. Clear legacy Xero cookies (security: remove plaintext tokens) ────
    cookieStore.delete('xero_access_token');
    cookieStore.delete('xero_refresh_token');
    cookieStore.delete('xero_tenant_id');
    cookieStore.delete('xero_id_token');
    // Clear the onboarding gate cookie — user has now connected Xero
    cookieStore.set('futrix_requires_xero_onboarding', 'false', {
      httpOnly: false,
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    // ── 9. Redirect: onboarding → /dashboard, reconnect → /settings ─────────
    const redirectUrl = wasOnboarding
      ? new URL('/summary', req.url)
      : new URL('/settings?integration=xero_success', req.url);

    return NextResponse.redirect(redirectUrl);
  } catch (error: any) {
    console.error('Xero callback error:', error);
    
    // Redirect onboarding users back to the connect page, existing users to settings
    const errorUrl = wasOnboarding 
      ? new URL(`/connect-xero?error=${encodeURIComponent(error.message || 'Unknown')}`, req.url)
      : new URL(`/settings?integration=xero_error&message=${encodeURIComponent(error.message || 'Unknown')}`, req.url);
      
    return NextResponse.redirect(errorUrl);
  }
}
