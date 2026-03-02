import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Thêm column isFlashSale vào Discount (idempotent)
  await prisma.$executeRaw`ALTER TABLE "Discount" ADD COLUMN IF NOT EXISTS "isFlashSale" BOOLEAN NOT NULL DEFAULT false`;
  console.log('✅ isFlashSale column OK');

  // Thêm column applicableToProducts
  await prisma.$executeRaw`ALTER TABLE "Discount" ADD COLUMN IF NOT EXISTS "applicableToProducts" INTEGER[] NOT NULL DEFAULT '{}'`;
  console.log('✅ applicableToProducts column OK');

  // Tạo indexes
  await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Discount_isFlashSale_idx" ON "Discount"("isFlashSale")`;
  console.log('✅ indexes OK');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
