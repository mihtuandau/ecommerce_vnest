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
import { buildCacheKey } from '../common/utils/cache-key.util';

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
    const cacheKey = buildCacheKey('products', query as any);
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
      status,
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

    // Filter theo trạng thái (map về isActive vì schema không có field draft riêng)
    if (status) {
      if (status === 'active') where.isActive = true;
      if (status === 'inactive' || status === 'draft') where.isActive = false;
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
    // Transform DTO to Prisma format
    const { categoryId, brandId, status, ...rest } = data;
    
    const updateData: any = {
      ...rest,
    };

    // Handle category relation
    if (categoryId !== undefined) {
      updateData.category = categoryId === null 
        ? { disconnect: true } 
        : { connect: { id: categoryId } };
    }

    // Handle brand relation
    if (brandId !== undefined) {
      updateData.brand = brandId === null
        ? { disconnect: true }
        : { connect: { id: brandId } };
    }

    // Map status to isActive (database field)
    if (status !== undefined) {
      updateData.isActive = status === 'active';
    }

    const product = await this.repository.update(id, updateData);
    await Promise.all([
      this.cacheManager.del('products:all'),
      this.cacheManager.del(`product:${id}`),
    ]);
    return product;
  }

  async remove(id: number): Promise<Product> {
    const product = await this.repository.findById(id);

    // Xóa ảnh trên Cloudinary song song (batch)
    if (product?.images?.length) {
      await Promise.all(
        product.images.map((image) => this.deleteImageFromCloudinary(image.url)),
      );
    }

    const deletedProduct = await this.repository.delete(id);
    await Promise.all([
      this.cacheManager.del('products:all'),
      this.cacheManager.del(`product:${id}`),
    ]);
    return deletedProduct;
  }

  async createVariant(data: CreateVariantDto): Promise<any> {
    // productId phải có (controller đã set từ URL param)
    if (!data.productId) {
      throw new BadRequestException('productId is required');
    }

    const productId = data.productId;

    // Default values nếu FE không truyền
    if (data.stock === undefined || data.stock === null) {
      (data as any).stock = 0;
    }

    if (data.price === undefined || data.price === null) {
      const product = await this.repository.findById(productId);
      if (!product) {
        throw new NotFoundException(`Product #${productId} không tồn tại`);
      }
      (data as any).price = product.basePrice;
    }

    if ((data as any).lowStockThreshold === undefined || (data as any).lowStockThreshold === null) {
      (data as any).lowStockThreshold = 5;
    }

    if ((data as any).isActive === undefined || (data as any).isActive === null) {
      (data as any).isActive = true;
    }

    const variant = await this.repository.createVariant(data as any);
    await Promise.all([
      this.cacheManager.del(`product:${productId}`),
      this.cacheManager.del('products:all'),
    ]);
    return variant;
  }

  async updateVariant(variantId: number, data: any): Promise<any> {
    const existing = await this.repository.findVariantById(variantId);
    if (!existing)
      throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    const updated = await this.repository.updateVariant(variantId, data);
    await Promise.all([
      this.cacheManager.del(`product:${updated.productId}`),
      this.cacheManager.del('products:all'),
    ]);
    return updated;
  }

  async deleteVariant(variantId: number): Promise<any> {
    const existing = await this.repository.findVariantById(variantId);
    if (!existing)
      throw new NotFoundException(`Variant #${variantId} không tồn tại`);

    // X\u00f3a VariantImages song song (batch)
    const images = await this.repository.findVariantImages(variantId);
    if (images.length) {
      await Promise.all([
        ...images.map((img) => this.deleteImageFromCloudinary(img.url)),
        this.repository.deleteVariantImages(images.map((img) => img.id)),
      ]);
    }

    const deleted = await this.repository.deleteVariant(variantId);
    await Promise.all([
      this.cacheManager.del(`product:${deleted.productId}`),
      this.cacheManager.del('products:all'),
    ]);
    return deleted;
  }

  /**
   * Upload images for Product (not variant)
   */
  async uploadProductImages(
    productId: number,
    files: Express.Multer.File[],
    metadata: { altText?: string; isThumbnail?: boolean; displayOrder?: number },
  ): Promise<any> {
    const product = await this.repository.findById(productId);

    if (!product) {
      throw new NotFoundException(`Sản phẩm #${productId} không tồn tại`);
    }

    const urls = await this.uploadService.uploadImages(files);

    // Nếu đặt làm thumbnail, bỏ thumbnail cũ
    if (metadata.isThumbnail) {
      await this.repository.updateThumbnailStatus(productId, false);
    }

    const imageData = urls.map((url, index) => ({
      productId,
      url,
      altText: metadata.altText || `${product.name} - Ảnh ${index + 1}`,
      isThumbnail: metadata.isThumbnail && index === 0,
      displayOrder: metadata.displayOrder !== undefined ? metadata.displayOrder + index : index,
    }));

    await this.repository.createImages(imageData);

    await Promise.all([
      this.cacheManager.del(`product:${productId}`),
      this.cacheManager.del('products:all'),
    ]);

    return {
      message: `Upload thành công ${urls.length} ảnh cho sản phẩm`,
      imageCount: urls.length,
    };
  }

  /**
   * Upload images for ProductVariant
   */
  async uploadVariantImages(
    variantId: number,
    files: Express.Multer.File[],
    metadata: { altText?: string; isPrimary?: boolean; displayOrder?: number },
  ): Promise<any> {
    const variant = await this.repository.findVariantById(variantId);

    if (!variant) {
      throw new NotFoundException(`Variant #${variantId} không tồn tại`);
    }

    const urls = await this.uploadService.uploadImages(files);

    // Nếu đặt làm primary, bỏ primary cũ
    if (metadata.isPrimary) {
      await this.repository.updateVariantPrimaryStatus(variantId, false);
    }

    const imageData = urls.map((url, index) => ({
      variantId,
      url,
      altText: metadata.altText || `Variant ${variant.size || ''} ${variant.color || ''} - Ảnh ${index + 1}`,
      isPrimary: metadata.isPrimary && index === 0,
      displayOrder: metadata.displayOrder !== undefined ? metadata.displayOrder + index : index,
    }));

    await this.repository.createVariantImages(imageData);

    await Promise.all([
      this.cacheManager.del(`product:${variant.productId}`),
      this.cacheManager.del('products:all'),
    ]);

    return {
      message: `Upload thành công ${urls.length} ảnh cho variant`,
      imageCount: urls.length,
    };
  }

  /**
   * Delete ProductImage
   */
  async deleteProductImage(imageId: number): Promise<any> {
    const image = await this.repository.findImageById(imageId);

    if (!image) {
      throw new NotFoundException(`Ảnh #${imageId} không tồn tại`);
    }

    await this.deleteImageFromCloudinary(image.url);
    await this.repository.deleteImages([imageId]);

    await Promise.all([
      this.cacheManager.del(`product:${image.productId}`),
      this.cacheManager.del('products:all'),
    ]);

    return {
      message: 'Xóa ảnh sản phẩm thành công',
      deletedImage: image,
    };
  }

  /**
   * Delete VariantImage
   */
  async deleteVariantImage(imageId: number): Promise<any> {
    const image = await this.repository.findVariantImageById(imageId);

    if (!image) {
      throw new NotFoundException(`Ảnh variant #${imageId} không tồn tại`);
    }

    await this.deleteImageFromCloudinary(image.url);
    await this.repository.deleteVariantImages([imageId]);

    // Lấy variant để clear cache
    const variant = await this.repository.findVariantById(image.variantId);
    if (variant) {
      await Promise.all([
        this.cacheManager.del(`product:${variant.productId}`),
        this.cacheManager.del('products:all'),
      ]);
    }

    return {
      message: 'Xóa ảnh variant thành công',
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
