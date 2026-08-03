const { PrismaClient } = require('@prisma/client');
const { XeroClient } = require('xero-node');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const prisma = new PrismaClient();
const xero = new XeroClient({
  clientId: process.env.XERO_CLIENT_ID || '',
  clientSecret: process.env.XERO_CLIENT_SECRET || '',
  redirectUris: [process.env.XERO_REDIRECT_URI || 'http://localhost:3000/api/xero/callback'],
  scopes: 'openid profile email accounting.invoices accounting.settings.read offline_access'.split(' '),
});

async function main() {
  const integrations = await prisma.integration.findMany({
    where: { provider: 'xero' }
  });
  if (integrations.length === 0) {
    console.log("No Xero integrations found in DB.");
    return;
  }

  const integration = integrations[0];
  
  try {
    await xero.initialize(); // ADDED INITIALIZE
    xero.setTokenSet({
      access_token: integration.accessToken,
      refresh_token: integration.refreshToken,
    });
    console.log("Attempting to refresh token...");
    const newTokenSet = await xero.refreshToken();
    console.log("Successfully refreshed token!");
    console.log("New access token length:", newTokenSet.access_token.length);
  } catch (err) {
    console.error("Refresh failed:");
    console.error(err.response ? err.response.body : err.message);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
