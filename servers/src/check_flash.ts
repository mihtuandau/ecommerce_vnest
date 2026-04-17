import { PrismaClient } from '@prisma/client';

async function checkProductDiscounts() {
  const prisma = new PrismaClient();
  const productId = 1; // Giả định là ID 1 (Áo thun)
  
  const links = await prisma.discountProduct.findMany({
    where: { productId },
    include: {
      discount: true
    }
  });

  console.log(`--- DISCOUNTS FOR PRODUCT ID ${productId} ---`);
  links.forEach(l => {
    console.log(`Code: ${l.discount.code}, ID: ${l.discount.id}, isFlashSale: ${l.discount.isFlashSale}, isActive: ${l.discount.isActive}, End: ${l.discount.endDate}`);
  });

  if (links.length === 0) {
    console.log('No direct product discounts found.');
  }

  await prisma.$disconnect();
}

checkProductDiscounts();
