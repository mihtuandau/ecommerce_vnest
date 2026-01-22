import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD') // Chuẩn hóa unicode
    .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '') // Xóa ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay khoảng trắng bằng -
    .replace(/-+/g, '-'); // Xóa - dư thừa
}

async function generateProductSlugs() {
  try {
    console.log('🔄 Đang tạo slugs cho products...');

    // Lấy tất cả products không có slug
    const products = await prisma.product.findMany({
      where: {
        slug: null,
      },
      select: {
        id: true,
        name: true,
      },
    });

    console.log(`📦 Tìm thấy ${products.length} products cần tạo slug`);

    // Tạo slug cho từng product
    for (const product of products) {
      let slug = generateSlug(product.name);
      let counter = 1;

      // Kiểm tra slug đã tồn tại chưa, nếu có thì thêm số
      while (await prisma.product.findUnique({ where: { slug } })) {
        slug = `${generateSlug(product.name)}-${counter}`;
        counter++;
      }

      await prisma.product.update({
        where: { id: product.id },
        data: { slug },
      });

      console.log(`✅ Product #${product.id}: "${product.name}" → "${slug}"`);
    }

    console.log('✨ Hoàn thành!');
  } catch (error) {
    console.error('❌ Lỗi:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

generateProductSlugs();
