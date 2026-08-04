const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const f = await prisma.forecast.findMany();
  console.log(JSON.stringify(f.map(x => ({ name: x.name, type: x.type })), null, 2));
  for (const item of f) {
    if (!["1yr-pl", "3yr-cf", "3yr-cf-inv"].includes(item.type)) {
      await prisma.forecast.update({
        where: { id: item.id },
        data: { type: "3yr-cf" }
      });
    }
  }
}
main().finally(() => prisma.$disconnect());