import { PrismaClient } from '@prisma/client';

async function forceExpire() {
  const prisma = new PrismaClient();
  const res = await prisma.discount.update({
    where: { id: 3 },
    data: {
      endDate: new Date('2026-04-10T00:00:00Z'), // Past date
    }
  });
  console.log('Flash Sale updated to past date:', res.endDate);
  await prisma.$disconnect();
}

forceExpire();
