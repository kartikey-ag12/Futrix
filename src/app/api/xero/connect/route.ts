import { NextResponse } from 'next/server';
import { XeroClient } from 'xero-node';

// Scopes required for Futrix features (transactions, reporting, insights)
const scopes = 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' ');

const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes,
});

export async function GET() {
  try {
    const consentUrl = await xero.buildConsentUrl();
    return NextResponse.redirect(consentUrl);
  } catch (error) {
    console.error("Error generating Xero consent URL:", error);
    return NextResponse.json({ error: 'Failed to generate consent URL' }, { status: 500 });
  }
}
