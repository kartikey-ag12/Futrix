import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';
import { cookies } from 'next/headers';

const scopes = 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' ');

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes,
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  
  try {
    // Exchange the authorization code from the URL for an Access Token
    const tokenSet = await xero.apiCallback(url.toString());
    
    // Fetch the connected organizations (tenants)
    await xero.updateTenants();
    const activeTenant = xero.tenants[0];

    if (!activeTenant) {
      throw new Error("No active tenant found");
    }

    // Save tokens in cookies temporarily (In production, save to PostgreSQL)
    const cookieStore = await cookies();
    cookieStore.set('xero_access_token', tokenSet.access_token || '', { path: '/' });
    cookieStore.set('xero_refresh_token', tokenSet.refresh_token || '', { path: '/' });
    cookieStore.set('xero_tenant_id', activeTenant.tenantId, { path: '/' });
    
    if (tokenSet.id_token) {
      cookieStore.set('xero_id_token', tokenSet.id_token, { path: '/' });
    }

    // Redirect back to settings page with success flag
    return NextResponse.redirect(new URL('/settings?integration=xero_success', req.url));
  } catch (error) {
    console.error("Xero callback error:", error);
    return NextResponse.redirect(new URL('/settings?integration=xero_error', req.url));
  }
}
