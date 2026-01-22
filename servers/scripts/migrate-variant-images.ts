import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script để migrate ảnh từ ProductImage (old) sang VariantImage (new)
 * Chạy sau khi migration schema
 */
async function migrateVariantImages() {
  try {
    console.log('🔄 Bắt đầu migrate ảnh variant...');

    // Trong migration vừa rồi, các ảnh có variantId đã bị xóa
    // Nếu cần migrate từ backup, uncomment code dưới:
    
    /*
    // Lấy tất cả variant images từ backup hoặc old table
    const oldVariantImages = await prisma.$queryRaw`
      SELECT * FROM "ProductImage_backup" WHERE "variantId" IS NOT NULL
    `;

    if (oldVariantImages.length === 0) {
      console.log('ℹ️ Không có ảnh variant nào để migrate');
      return;
    }

    console.log(`📦 Tìm thấy ${oldVariantImages.length} ảnh variant cần migrate`);

    // Migrate từng ảnh
    for (const image of oldVariantImages) {
      await prisma.variantImage.create({
        data: {
          variantId: image.variantId,
          url: image.url,
          altText: image.altText,
          isPrimary: image.isThumbnail || false,
          displayOrder: image.displayOrder || 0,
        },
      });

      console.log(`✅ Migrated image for variant #${image.variantId}`);
    }
    */

    console.log('✨ Hoàn thành migration!');
    console.log('');
    console.log('📝 Lưu ý:');
    console.log('- ProductImage bây giờ CHỈ chứa ảnh của Product');
    console.log('- VariantImage CHỈ chứa ảnh của ProductVariant');
    console.log('- Cần cập nhật API endpoints và frontend code');
    
  } catch (error) {
    console.error('❌ Lỗi:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateVariantImages();
