import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const usages = await prisma.discountUsage.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { email: true } },
      discount: { select: { code: true } },
    },
  });
  console.log('--- RECENT DISCOUNT USAGES ---');
  console.log(JSON.stringify(usages, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
