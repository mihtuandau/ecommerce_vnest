import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProductRepository } from './product.repository';
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
    private repository: ProductRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private uploadService: UploadService,
  ) {}

  async create(data: CreateProductDto): Promise<Product> {
    const product = await this.repository.create(data as any);
    await this.cacheManager.del('products:all');
    return product;
  }

  async findAll(query: QueryProductDto): Promise<any> {
    const cacheKey = `products:${JSON.stringify(query)}`;
    let cached = await this.cacheManager.get<any>(cacheKey);
    if (cached) {
      return cached;
    }
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      brandId,
      minPrice,
      maxPrice,
      minRating,
      sortBy = 'newest',
      inStock,
      outOfStock,
    } = query;

    const skip = (page - 1) * limit;

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

    if (minRating) {
      where.averageRating = { gte: minRating };
    }

    if (inStock) {
      where.variants = {
        some: {
          stock: { gt: 0 },
        },
      };
    }

    if (outOfStock) {
      where.variants = {
        every: {
          stock: { lte: 0 },
        },
      };
    }

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
      case 'sold':
        orderBy = { soldCount: 'desc' };
        break;
      case 'rating':
        orderBy = { averageRating: 'desc' };
        break;
      case 'oldest':
        orderBy = { createdAt: 'asc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [total, products] = await Promise.all([
      this.repository.count(where),
      this.repository.findAll(where, skip, limit, orderBy),
    ]);

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
    const result = await this.repository.getPriceRange();
    return result;
  }

  async findOne(id: number): Promise<any | null> {
    const cacheKey = `product:${id}`;
    let product = await this.cacheManager.get(cacheKey);
    if (product) {
      return product;
    }

    product = await this.repository.findById(id);

    if (product) {
      await this.cacheManager.set(cacheKey, product, 1800);
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto): Promise<Product> {
    const product = await this.repository.update(id, data);
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.repository.findById(id);

    if (product?.images) {
      for (const image of product.images) {
        await this.deleteImageFromCloudinary(image.url);
      }
    }

    const deletedProduct = await this.repository.delete(id);
    await this.cacheManager.del('products:all');
    await this.cacheManager.del(`product:${id}`);
    return deletedProduct;
  }

  async createVariant(data: CreateVariantDto): Promise<any> {
    const variant = await this.repository.createVariant(data as any);
    await this.cacheManager.del(`product:${data.productId}`);
    await this.cacheManager.del('products:all');
    return variant;
  }

  async updateVariant(variantId: number, data: any): Promise<any> {
    const existing = await this.repository.findVariantById(variantId);
    if (!existing)
      throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    const updated = await this.repository.updateVariant(variantId, data);
    await this.cacheManager.del(`product:${updated.productId}`);
    await this.cacheManager.del('products:all');
    return updated;
  }

  async deleteVariant(variantId: number): Promise<any> {
    const existing = await this.repository.findVariantById(variantId);
    if (!existing)
      throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    const images = await this.repository.findImagesByVariant(variantId);
    for (const img of images) {
      await this.deleteImageFromCloudinary(img.url);
      await this.repository.deleteImages([img.id]);
    }

    const deleted = await this.repository.deleteVariant(variantId);
    await this.cacheManager.del(`product:${deleted.productId}`);
    await this.cacheManager.del('products:all');
    return deleted;
  }

  async uploadProductImages(
    productId: number,
    files: Express.Multer.File[],
    metadata: { altText?: string; isThumbnail?: boolean; variantId?: number },
  ): Promise<any> {
    const product = await this.repository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
    }

    const urls = await this.uploadService.uploadImages(files);

    if (metadata.isThumbnail) {
      await this.repository.updateThumbnailStatus(
        productId,
        metadata.variantId || null,
        false,
      );
    }

    const imageData = urls.map((url, index) => ({
      productId,
      variantId: metadata.variantId || null,
      url,
      altText: metadata.altText || `${product.name} - Ảnh ${index + 1}`,
      isThumbnail: metadata.isThumbnail && index === 0,
    }));

    await this.repository.createImages(imageData);

    await this.cacheManager.del(`product:${productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: `Upload thành công ${urls.length} ảnh`,
      imageCount: urls.length,
    };
  }

  async deleteProductImage(imageId: number): Promise<any> {
    const image = await this.repository.findImageById(imageId);

    if (!image) {
      throw new NotFoundException(`Ảnh #${imageId} không tồn tại`);
    }

    await this.deleteImageFromCloudinary(image.url);

    await this.repository.deleteImages([imageId]);

    await this.cacheManager.del(`product:${image.productId}`);
    await this.cacheManager.del('products:all');

    return {
      message: 'Xóa ảnh thành công',
      deletedImage: image,
    };
  }

  private async deleteImageFromCloudinary(imageUrl: string): Promise<void> {
    try {
      const parts = imageUrl.split('/');
      const uploadIndex = parts.indexOf('upload');

      if (uploadIndex === -1) return;

      const pathParts = parts.slice(uploadIndex + 2);
      const publicId = pathParts.join('/').replace(/\.[^/.]+$/, '');
    } catch (error) {}
  }

  async incrementSoldCount(productId: number, quantity: number) {
    await this.repository.incrementSoldCount(productId, quantity);
    await this.cacheManager.del(`product:${productId}`);
  }
}
