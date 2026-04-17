import { PrismaClient } from '@prisma/client';

async function checkProduct1() {
  const prisma = new PrismaClient();
  const product = await prisma.product.findUnique({
      where: { id: 1 },
      include: {
          variants: true
      }
  });
  console.log(JSON.stringify(product, null, 2));
  await prisma.$disconnect();
}
checkProduct1();
