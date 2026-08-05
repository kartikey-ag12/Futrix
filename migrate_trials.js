const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting trial migration...");
  
  const workspaces = await prisma.workspace.findMany({
    where: { trialEndsAt: null },
  });

  console.log(`Found ${workspaces.length} workspaces to migrate.`);

  const now = new Date();
  
  for (const ws of workspaces) {
    // 14 days after creation
    const originalTrialEnd = new Date(ws.createdAt.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    // Give them at least 3 days from today to avoid abrupt lockout if they were created > 14 days ago
    const gracePeriodEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    
    const finalTrialEnd = originalTrialEnd > now ? originalTrialEnd : gracePeriodEnd;
    
    await prisma.workspace.update({
      where: { id: ws.id },
      data: { trialEndsAt: finalTrialEnd },
    });
    console.log(`Updated Workspace ${ws.name} (${ws.id}) - trial ends at ${finalTrialEnd.toISOString()}`);
  }

  console.log("Migration complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
