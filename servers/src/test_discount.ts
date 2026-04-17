import { PrismaClient } from '@prisma/client';

async function testQuery() {
  const prisma = new PrismaClient();
  const now = new Date();

  const flashSale = await prisma.discount.findFirst({
      where: {
        isFlashSale: true,
        isActive: true,
        startDate: { lte: now },
        OR: [{ endDate: null }, { endDate: { gte: now } }],
      },
      orderBy: { endDate: 'asc' },
      select: {
        id: true,
        code: true,
        applicableToCategories: true,
        applicableToProducts: true,
      },
    });
    
  console.log('FLASH SALE IN DB:', flashSale);
  
  if (flashSale) {
    const productWhere: any = { isActive: true };
    if (flashSale.applicableToProducts.length > 0) {
      productWhere.id = {
        in: flashSale.applicableToProducts.map((dp: any) => dp.productId),
      };
    } else if (flashSale.applicableToCategories.length > 0) {
      productWhere.categoryId = {
        in: flashSale.applicableToCategories.map((dc: any) => dc.categoryId),
      };
    }
    
    console.log('productWhere fallback is using:', productWhere);
    
    const products = await prisma.product.findMany({
      where: productWhere,
      take: 8,
      orderBy: flashSale.applicableToProducts.length > 0 ? { id: 'asc' } : { soldCount: 'desc' },
      select: { id: true, name: true }
    });
    console.log('Global Flash Sale Products (Top 8 if fallback):', products);
  }

  await prisma.$disconnect();
}
testQuery();
