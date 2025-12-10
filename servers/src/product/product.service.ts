import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { UploadService } from '../upload/upload.service';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.prisma.product.create({ 
      data, 
      include: { variants: true, images: true, category: true, brand: true } 
    });
    await this.cacheManager.del('products:all');
    return product;
  }

  async findAll(query: QueryProductDto): Promise<any> {
    const cacheKey = `products:${JSON.stringify(query)}`;
    let cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) {return cached;
    }const { 
      page = 1, 
      limit = 10, 
      search, 
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      sortBy = 'newest',
      inStock
    } = query;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    if (brandId) {
      where.brandId = brandId;
    }
    
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = minPrice;
      if (maxPrice) where.basePrice.lte = maxPrice;
    }
    
    if (inStock) {
      where.stock = { gt: 0 };
    }
    
    // Build order by
    let orderBy: any = {};
    switch (sortBy) {
      case 'price-asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price-desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'name-asc':
        orderBy = { name: 'asc' };
        break;
      case 'name-desc':
        orderBy = { name: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    // Get total count
    const total = await this.prisma.product.count({ where });
    
    // Get products
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: { 
        variants: true, 
        images: true, 
        category: true, 
        brand: true 
      },
    });

    const result = {
      data: products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };

    await this.cacheManager.set(cacheKey, result, 3600);
    return result;
  }

  async getPriceRange() {
    const result = await this.prisma.product.aggregate({
      _min: {
        basePrice: true,
      },
      _max: {
        basePrice: true,
      },
    });

    return {
      minPrice: result._min.basePrice || 0,
      maxPrice: result._max.basePrice || 10000000,
    };
  }

  async findOne(id: number): Promise<any | null> {
    const cacheKey = `product:${id}`;
    let product = await this.cacheManager.get(cacheKey);
    if (product) {
      return product;
    }

    product = await this.prisma.product.findUnique({
      where: { id },
      include: { variants: true, images: true, category: true, brand: true },
    });

    if (product) {
      await this.cacheManager.set(cacheKey, product, 1800);
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.prisma.product.update({ where: { id }, data });
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return product;
  }

  async remove(id: number): Promise<Product> {
    // Xóa ảnh trên Cloudinary trước
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { images: true }
    });

    if (product?.images) {
      for (const image of product.images) {
        await this.deleteImageFromCloudinary(image.url);
      }
    }

    const deletedProduct = await this.prisma.product.delete({ where: { id } });
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return deletedProduct;
  }

  async createVariant(data: CreateVariantDto): Promise<any> {
    const variant = await this.prisma.productVariant.create({ data });
    await this.cacheManager.del(`product:${data.productId}`);
    await this.cacheManager.del('products:all');
    return variant;
  }

  async updateVariant(variantId: number, data: any): Promise<any> {
    const existing = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    const updated = await this.prisma.productVariant.update({ where: { id: variantId }, data });
    await this.cacheManager.del(`product:${updated.productId}`);
    await this.cacheManager.del('products:all');
    return updated;
  }

  async deleteVariant(variantId: number): Promise<any> {
    const existing = await this.prisma.productVariant.findUnique({ where: { id: variantId } });
    if (!existing) throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    // remove any images associated with this variant
    const images = await this.prisma.productImage.findMany({ where: { variantId } });
    for (const img of images) {
      await this.deleteImageFromCloudinary(img.url);
      await this.prisma.productImage.delete({ where: { id: img.id } });
    }

    const deleted = await this.prisma.productVariant.delete({ where: { id: variantId } });
    await this.cacheManager.del(`product:${deleted.productId}`);
    await this.cacheManager.del('products:all');
    return deleted;
  }

  // ============ UPLOAD ẢNH TỪ MÁY TÍNH ============
  async uploadProductImages(
    productId: number,
    files: Express.Multer.File[],
    metadata: { altText?: string; isThumbnail?: boolean; variantId?: number }
  ): Promise<any> {
    // 1. Kiểm tra product tồn tại
    const product = await this.prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
    }

    // 2. Upload lên Cloudinary
    const urls = await this.uploadService.uploadImages(files);

    // 3. Nếu set thumbnail, bỏ thumbnail cũ
    if (metadata.isThumbnail) {
      if (metadata.variantId) {
        // unset thumbnail only for this variant's images
        await this.prisma.productImage.updateMany({
          where: { productId, variantId: metadata.variantId },
          data: { isThumbnail: false }
        });
      } else {
        // unset thumbnail for product-level images
        await this.prisma.productImage.updateMany({
          where: { productId, variantId: null },
          data: { isThumbnail: false }
        });
      }
    }

    // 4. Lưu vào DB (transaction để đảm bảo tất cả thành công)
    const images = await this.prisma.$transaction(
      urls.map((url, index) =>
        this.prisma.productImage.create({
          data: {
            productId,
            variantId: metadata.variantId || null,
            url,
            altText: metadata.altText || `${product.name} - Ảnh ${index + 1}`,
            isThumbnail: metadata.isThumbnail && index === 0, // Chỉ ảnh đầu làm thumbnail
          }
        })
      )
    );

    // 5. Invalidate cache
    await this.cacheManager.del(`product:${productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: `Upload thành công ${images.length} ảnh`,
      images,
    };
  }

  // ============ XÓA ẢNH ============
  async deleteProductImage(imageId: number): Promise<any> {
    const image = await this.prisma.productImage.findUnique({
      where: { id: imageId }
    });

    if (!image) {
      throw new NotFoundException(`Ảnh #${imageId} không tồn tại`);
    }

    // Xóa trên Cloudinary
    await this.deleteImageFromCloudinary(image.url);

    // Xóa trong DB
    await this.prisma.productImage.delete({
      where: { id: imageId }
    });

    // Invalidate cache
    await this.cacheManager.del(`product:${image.productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: 'Xóa ảnh thành công',
      deletedImage: image,
    };
  }

  // Helper: Extract public_id và xóa trên Cloudinary
  private async deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    try {
      // URL format: https://res.cloudinary.com/xxx/image/upload/v123/folder/image.jpg
      const parts = imageUrl.split('/');
      const uploadIndex = parts.indexOf('upload');
      
      if (uploadIndex === -1) return;

      // Lấy phần sau "upload/v123/"
      const pathParts = parts.slice(uploadIndex + 2); // Skip 'upload' and version
      const publicId = pathParts.join('/').replace(/\.[^/.]+$/, ''); // Remove extensionawait cloudinary.uploader.destroy(publicId);
    } catch (error) {// Không throw error để không block việc xóa trong DB
    }
  }

  // Cập nhật soldCount khi order delivered (called from OrderService)
  async incrementSoldCount(productId: number, quantity: number) {
    await this.prisma.product.update({
      where: { id: productId },
      data: {
        soldCount: {
          increment: quantity,
        },
      },
    });

    await this.cacheManager.del(`product:${productId}`);
  }
}