const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({ select: { id: true, email: true, requiresXeroOnboarding: true } });
  console.log('--- USERS ---');
  console.log(users);

  const workspaces = await prisma.workspace.findMany();
  console.log('--- WORKSPACES ---');
  console.log(workspaces);

  const integrations = await prisma.integration.findMany();
  console.log('--- INTEGRATIONS ---');
  console.log(integrations);

  const pl = await prisma.pLReport.count();
  console.log('--- PL REPORTS COUNT ---', pl);

  const bs = await prisma.balanceSheetReport.count();
  console.log('--- BS REPORTS COUNT ---', bs);

  const invoices = await prisma.invoice.count();
  console.log('--- INVOICES COUNT ---', invoices);
}

main().catch(console.error).finally(() => prisma.$disconnect());
