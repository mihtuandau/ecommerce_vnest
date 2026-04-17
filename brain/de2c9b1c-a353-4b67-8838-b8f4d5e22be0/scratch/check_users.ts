import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      status: true,
      deletedAt: true,
      role: true
    },
    orderBy: { id: 'asc' }
  });
  
  console.log('--- USER DATA IN DB ---');
  console.table(users);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
