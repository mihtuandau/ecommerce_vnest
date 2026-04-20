
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Dọn dẹp dữ liệu ZALOPAY...');
    
    // Cập nhật bảng Payment
    const paymentResult = await prisma.$executeRawUnsafe(
      `UPDATE "Payment" SET "method" = 'CASH' WHERE "method"::text = 'ZALOPAY'`
    );
    console.log(`Đã cập nhật ${paymentResult} bản ghi trong bảng Payment`);

    // Cập nhật bảng Order
    const orderResult = await prisma.$executeRawUnsafe(
      `UPDATE "Order" SET "paymentMethod" = 'CASH' WHERE "paymentMethod" = 'ZALOPAY'`
    );
    console.log(`Đã cập nhật ${orderResult} bản ghi trong bảng Order`);

  } catch (error) {
    console.error('Lỗi khi dọn dẹp dữ liệu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
