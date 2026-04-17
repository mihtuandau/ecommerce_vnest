import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.user.update({
    where: { id: 4 },
    data: { deletedAt: null }
  });
  console.log('✅ User ID 4 restored successfully.');
}
main().finally(() => prisma.$disconnect());
