import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function syncSoldCount() {
  console.log('Starting soldCount synchronization...');

  // 1. Reset all soldCounts to 0 first
  await prisma.product.updateMany({
    data: { soldCount: 0 }
  });
  console.log('Reset all soldCounts to 0.');

  // 2. Get all delivered and paid orders
  const orders = await prisma.order.findMany({
    where: {
      status: 'DELIVERED',
      payment: { status: 'SUCCESS' }
    },
    include: {
      orderItems: {
        include: {
          variant: true
        }
      }
    }
  });

  console.log(`Found ${orders.length} delivered and paid orders.`);

  // 3. Aggregate sold counts per product
  const productSales = new Map<number, number>();

  for (const order of orders) {
    for (const item of order.orderItems) {
      if (item.variant) {
        const productId = item.variant.productId;
        const current = productSales.get(productId) || 0;
        productSales.set(productId, current + item.quantity);
      }
    }
  }

  // 4. Update products with correct counts
  for (const [productId, totalSold] of productSales.entries()) {
    await prisma.product.update({
      where: { id: productId },
      data: { soldCount: totalSold }
    });
    console.log(`Updated Product ID ${productId}: soldCount = ${totalSold}`);
  }

  console.log('Synchronization complete!');
}

syncSoldCount()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
