const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const user = await prisma.user.findFirst({
    where: { email: 'kartikey1212@gmail.com' }
  });
  console.log('User:', user?.email, 'requiresXeroOnboarding:', user?.requiresXeroOnboarding);

  const memberships = await prisma.workspaceMember.findMany({
    where: { userId: user?.id }
  });
  console.log('Workspaces:', memberships.length);
  
  for (const m of memberships) {
    const integrations = await prisma.integration.findMany({
      where: { workspaceId: m.workspaceId }
    });
    console.log('Integrations for workspace', m.workspaceId, ':', integrations.map(i => i.provider));
  }
}

check().then(() => process.exit(0)).catch(console.error);
