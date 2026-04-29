import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProductRepository } from './product.repository';
import { UploadService } from '../upload/upload.service';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class ProductService {
  constructor(
    private repo: ProductRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private uploadService: UploadService,
  ) {}

  private slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/([^0-9a-z-\s])/g, '')
      .replace(/(\s+)/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async create(data: any) {
    const { status, images, variants, ...rest } = data;

    const prismaData: any = {
      ...rest,
      isActive: status !== 'inactive',
      slug: this.slugify(rest.name),
      basePrice: rest.basePrice ? Number(rest.basePrice) : 0,
      originalPrice: rest.originalPrice ? Number(rest.originalPrice) : null,
    };

    if (rest.categoryId) {
      prismaData.category = { connect: { id: Number(rest.categoryId) } };
      delete prismaData.categoryId;
    }

    if (rest.brandId) {
      prismaData.brand = { connect: { id: Number(rest.brandId) } };
      delete prismaData.brandId;
    }

    if (images && Array.isArray(images)) {
      prismaData.images = {
        create: images.map((img: any, i: number) => ({
          url: typeof img === 'string' ? img : img.url,
          isThumbnail: i === 0,
          displayOrder: i,
          altText: rest.name,
        })),
      };
    }

    if (variants && Array.isArray(variants)) {
      prismaData.variants = {
        create: variants.map((v: any) => {
          const variantData: any = {
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: Number(v.price || rest.basePrice || 0),
            originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
            stock: Number(v.stock || 0),
            isActive: true,
          };

          if (v.image) {
            variantData.images = {
              create: [
                {
                  url: typeof v.image === 'string' ? v.image : v.image.url,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            };
          }

          return variantData;
        }),
      };
    }

    await this.cache.del('products:all');
    return this.repo.create(prismaData);
  }

  async findAll(q: any) {
    const key = buildCacheKey('products', q);
    const cached = await this.cache.get(key);
    if (cached) return cached;
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
      status,
      inStock,
      outOfStock,
    } = q;
    const where: any = { deletedAt: null }; // Filter out soft-deleted products
    const searchTrimmed = search?.trim();
    if (searchTrimmed) {
      where.OR = [
        { name: { contains: searchTrimmed, mode: 'insensitive' } },
        { description: { contains: searchTrimmed, mode: 'insensitive' } },
        { category: { name: { contains: searchTrimmed, mode: 'insensitive' } } },
        { brand: { name: { contains: searchTrimmed, mode: 'insensitive' } } },
      ];
    }
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (minPrice || maxPrice)
      where.basePrice = { gte: minPrice, lte: maxPrice };
    if (minRating) where.averageRating = { gte: minRating };
    if (status) {
      if (status !== 'all') {
        where.isActive = status === 'active';
      }
    } else {
      // Default for customers: only show active products
      where.isActive = true;
    }
    if (inStock) where.variants = { some: { stock: { gt: 0 } } };
    if (outOfStock) where.variants = { every: { stock: { lte: 0 } } };
    const sortMap = {
      newest: { createdAt: 'desc' },
      oldest: { createdAt: 'asc' },
      'price-asc': { basePrice: 'asc' },
      'price-desc': { basePrice: 'desc' },
      'name-asc': { name: 'asc' },
      'name-desc': { name: 'desc' },
      sold: { soldCount: 'desc' },
      rating: { averageRating: { sort: 'desc', nulls: 'last' } },
    };
    const [total, products] = await Promise.all([
      this.repo.count(where),
      this.repo.findAll(
        where,
        (page - 1) * limit,
        limit,
        sortMap[sortBy] || { createdAt: 'desc' },
      ),
    ]);
    const res = {
      data: products,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
    await this.cache.set(key, res, 3600 * 1000); // v5+ expects ms
    return res;
  }

  async findOne(id: any, full = false) {
    if (full) return this.repo.findByIdOrSlug(id, true);
    
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return cached;
    
    const p = await this.repo.findByIdOrSlug(id, false);
    
    // Security check: If not in full (admin) mode, ensure product is active
    if (!full && p && !p.isActive) {
      throw new NotFoundException('Sản phẩm hiện không khả dụng');
    }

    if (p) await this.cache.set(`product:${id}`, p, 1800 * 1000); // v5+ expects ms
    return p;
  }

  async update(id: number, data: any) {
    const { status, images, variants, ...rest } = data;

    const prismaData: any = {
      ...rest,
    };

    if (rest.basePrice !== undefined) prismaData.basePrice = Number(rest.basePrice);
    if (rest.originalPrice !== undefined) prismaData.originalPrice = rest.originalPrice ? Number(rest.originalPrice) : null;

    if (rest.name) {
      prismaData.slug = this.slugify(rest.name);
    }

    if (rest.categoryId) {
      prismaData.category = { connect: { id: Number(rest.categoryId) } };
      delete prismaData.categoryId;
    }

    if (rest.brandId) {
      prismaData.brand = { connect: { id: Number(rest.brandId) } };
      delete prismaData.brandId;
    }

    if (status !== undefined) {
      prismaData.isActive = status === 'active';
    }

    console.log(
      `[DEBUG] Updating product ${id} with prismaData:`,
      JSON.stringify(prismaData, null, 2),
    );

    // Handle nested images and variants if they are provided
    // This is a simplified implementation: delete existing and create new
    // to match the frontend state 1:1.
    if (images && Array.isArray(images)) {
      // Fetch existing images to delete from Cloudinary
      const existingImages = await this.repo.findImagesByProductId(id);
      for (const img of existingImages) {
        await this.uploadService.deleteImage(img.url);
      }
      
      // Clear existing images and create new ones
      await this.repo.deleteImagesByProductId(id);
      prismaData.images = {
        create: images.map((img: any, i: number) => ({
          url: typeof img === 'string' ? img : img.url,
          isThumbnail: i === 0,
          displayOrder: i,
          altText: rest.name || '',
        })),
      };
    }

    if (variants && Array.isArray(variants)) {
      const currentProduct = await this.repo.findById(id);
      const existingVariants = currentProduct?.variants || [];
      
      const updateOperations: any[] = [];
      const createOperations: any[] = [];

      // 1. Mark all existing variants as inactive first
      existingVariants.forEach((ev: any) => {
        updateOperations.push({
          where: { id: ev.id },
          data: { isActive: false }
        });
      });

      // 2. Process the incoming variants
      for (const v of variants) {
        const existing = v.id ? existingVariants.find((ev: any) => ev.id === v.id) : null;
        
        if (existing) {
          // If variant exists, update it and set isActive back to true
          // We need to find the previous update operation for this ID and replace it
          const opIndex = updateOperations.findIndex(op => op.where.id === existing.id);
          const updateData: any = {
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: Number(v.price || rest.basePrice || 0),
            originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
            stock: Number(v.stock || 0),
            isActive: true,
          };

          if (v.image) {
            // Fetch old variant images to delete from Cloudinary
            const oldVImages = await this.repo.findImagesByVariantId(existing.id);
            for (const img of oldVImages) {
              await this.uploadService.deleteImage(img.url);
            }

            updateData.images = {
              deleteMany: {}, // Clear old images in DB
              create: [
                {
                  url: typeof v.image === 'string' ? v.image : v.image.url,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            };
          }
          
          if (opIndex > -1) {
            updateOperations[opIndex].data = updateData;
          } else {
            updateOperations.push({
              where: { id: existing.id },
              data: updateData
            });
          }
        } else {
          // New variant
          const variantData: any = {
            size: v.size,
            color: v.color,
            sku: v.sku,
            price: Number(v.price || rest.basePrice || 0),
            originalPrice: v.originalPrice ? Number(v.originalPrice) : null,
            stock: Number(v.stock || 0),
            isActive: true,
          };

          if (v.image) {
            variantData.images = {
              create: [
                {
                  url: typeof v.image === 'string' ? v.image : v.image.url,
                  isPrimary: true,
                  displayOrder: 0,
                },
              ],
            };
          }

          createOperations.push(variantData);
        }
      }

      prismaData.variants = {
        update: updateOperations,
        create: createOperations,
      };
    }

    const p = await this.repo.update(id, prismaData);

    // Comprehensive cache invalidation
    const cacheKeys = ['products:all', `product:${id}`];

    if (p.slug) {
      cacheKeys.push(`product:${p.slug}`);
    }

    // Attempt to clear all list caches (keys starting with products:)
    // Since default cache manager might not support wildcards, we at least clear the common ones
    // or we can use a more global clear if the store allows it.

    await Promise.all(cacheKeys.map((key) => this.cache.del(key)));

    // Optional: If we want to be safe and clear everything related to products
    // await this.cache.reset(); // Too aggressive, but safe

    return p;
  }

  async remove(id: number) {
    const p = await this.repo.delete(id);
    await Promise.all([
      this.cache.del('products:all'),
      this.cache.del(`product:${id}`),
    ]);
    return p;
  }

  async createVariant(data: any) {
    const v = await this.repo.createVariant(data);
    await this.cache.del(`product:${data.productId}`);
    return v;
  }

  async updateVariant(id: number, data: any) {
    const v = await this.repo.updateVariant(id, data);
    await this.cache.del(`product:${v.productId}`);
    return v;
  }

  async deleteVariant(id: number) {
    const v = await this.repo.deleteVariant(id);
    await this.cache.del(`product:${v.productId}`);
    return v;
  }

  async uploadProductImages(id: number, files: any[], meta: any) {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const urls = await this.uploadService.uploadImages(files);
    if (meta.isThumbnail) await this.repo.updateThumbnailStatus(id, false);
    await this.repo.createImages(
      urls.map((u, i) => ({
        productId: id,
        url: u,
        isThumbnail: meta.isThumbnail && i === 0,
        displayOrder: (meta.displayOrder || 0) + i,
      })),
    );
    await this.cache.del(`product:${id}`);
    return { urls };
  }

  async uploadVariantImages(vId: number, files: any[], meta: any) {
    const v = await this.repo.findVariantById(vId);
    if (!v) throw new NotFoundException('Biến thể sản phẩm không tồn tại');
    const urls = await this.uploadService.uploadImages(files);
    await this.repo.createVariantImages(
      urls.map((u, i) => ({
        variantId: vId,
        url: u,
        isPrimary: meta.isPrimary && i === 0,
        displayOrder: (meta.displayOrder || 0) + i,
      })),
    );
    await this.cache.del(`product:${v.productId}`);
    return { urls };
  }

  async deleteProductImage(id: number) {
    const img = await this.repo.findImageById(id);
    if (!img) throw new NotFoundException();
    
    // Delete from Cloudinary
    await this.uploadService.deleteImage(img.url);
    
    await this.repo.deleteImages([id]);
    await this.cache.del(`product:${img.productId}`);
    return { id };
  }

  async deleteVariantImage(id: number) {
    const img = await this.repo.findVariantImageById(id);
    if (!img) throw new NotFoundException();

    // Delete from Cloudinary
    await this.uploadService.deleteImage(img.url);

    await this.repo.deleteVariantImages([id]);
    const v = await this.repo.findVariantById(img.variantId);
    if (v) await this.cache.del(`product:${v.productId}`);
    return { id };
  }

  async incrementViewCount(id: number, identifier: string) {
    const key = `viewed:${id}:${identifier}`;
    if (!(await this.cache.get(key))) {
      await this.repo.incrementViewCount(id);
      await this.cache.set(key, true, 86400 * 1000);
      await this.cache.del(`product:${id}`);
    }
  }

  async getRelatedProducts(id: number, limit = 8) {
    const p = await this.repo.findByIdOrSlug(id);
    if (!p) throw new NotFoundException();
    if (!p.categoryId) return [];
    return this.repo.findRelated(p.id, p.categoryId, limit);
  }

  async getPriceRange() {
    return this.repo.getPriceRange();
  }
}
