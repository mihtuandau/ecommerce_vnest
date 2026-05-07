import { Injectable, Inject, NotFoundException, OnModuleInit } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProductRepository } from './product.repository';
import { UploadService } from '../upload/upload.service';
import { buildCacheKey } from '../common/utils/cache-key.util';
import { createClient } from 'redis';

@Injectable()
export class ProductService implements OnModuleInit {
  private redisClient: any;
  constructor(
    private repo: ProductRepository,
    @Inject(CACHE_MANAGER) private cache: Cache,
    private uploadService: UploadService,
  ) {}

  async onModuleInit() {
    try {
      this.redisClient = createClient({
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || undefined,
        socket: {
          host: process.env.REDIS_HOST || 'localhost',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
        },
      });
      await this.redisClient.connect();
      console.log('✅ [ProductService] Trực tiếp kết nối Redis để làm nhiệm vụ dọn Cache (Wildcard Deletion)');
    } catch (err) {
      console.error('❌ [ProductService] Không thể kết nối Redis trực tiếp:', err.message);
    }
  }

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

  private async clearProductCaches(productId?: number, slug?: string) {
    try {
      if (this.redisClient) {
        let cursor = '0';
        const pattern = '*products*';
        do {
          const reply = await this.redisClient.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = typeof reply === 'string' ? '0' : reply[0];
          const keys = typeof reply === 'string' ? [] : reply[1];
          
          if (keys && keys.length > 0) {
            await this.redisClient.del(keys);
          }
        } while (cursor !== '0');
      } else {
        await this.cache.del('products:all'); 
      }
    } catch (err) {
      console.error('Error clearing product caches:', err.message);
    }
    
    if (productId) await this.cache.del(`product:${productId}`);
    if (slug) await this.cache.del(`product:${slug}`);
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

    await this.clearProductCaches();
    return this.repo.create(prismaData);
  }

  async findAll(q: any) {
    const key = buildCacheKey('products', q);
    
    // BỎ QUA CACHE ĐỐI VỚI ADMIN (Admin luôn cần dữ liệu realtime)
    // Dấu hiệu nhận biết Admin: status = 'all' hoặc limit quá lớn
    const isAdmin = q.status === 'all' || Number(q.limit) >= 100;

    if (!isAdmin) {
      const cached = await this.cache.get(key);
      if (cached) return cached;
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
    if (categoryId) where.categoryId = Number(categoryId);
    if (brandId) where.brandId = Number(brandId);
    if (minPrice || maxPrice) {
      where.basePrice = {};
      if (minPrice) where.basePrice.gte = Number(minPrice);
      if (maxPrice) where.basePrice.lte = Number(maxPrice);
    }
    if (minRating) where.averageRating = { gte: Number(minRating) };
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
    
    // Chỉ lưu Cache cho người dùng (Customer)
    if (!isAdmin) {
      await this.cache.set(key, res, 3600 * 1000); // v5+ expects ms
    }
    return res;
  }

  async findOne(id: any, full = false) {
    if (full) return this.repo.findByIdOrSlug(id, true);
    
    const cached = await this.cache.get(`product:${id}`) as any;
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
      const incomingUrls = images.map((img: any) => typeof img === 'string' ? img : img.url);
      // Fetch existing images to delete from Cloudinary ONLY IF they are removed
      const existingImages = await this.repo.findImagesByProductId(id);
      for (const img of existingImages) {
        if (!incomingUrls.includes(img.url)) {
          await this.uploadService.deleteImage(img.url);
        }
      }
      
      // Clear existing images in DB and create new ones
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
            const incomingUrl = typeof v.image === 'string' ? v.image : v.image.url;
            // Fetch old variant images to delete from Cloudinary ONLY IF changed
            const oldVImages = await this.repo.findImagesByVariantId(existing.id);
            for (const img of oldVImages) {
              if (img.url !== incomingUrl) {
                await this.uploadService.deleteImage(img.url);
              }
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

    // Xóa sạch sẽ toàn bộ Cache liên quan đến sản phẩm này để Admin thấy ngay lập tức
    await this.clearProductCaches(id, p.slug || undefined);

    return p;
  }

  async remove(id: number) {
    const p = await this.repo.delete(id);
    await this.clearProductCaches(id, p.slug || undefined);
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
      const p = await this.repo.findById(id);
      if (p) {
        await this.repo.incrementViewCount(id);
        await this.cache.set(key, true, 86400 * 1000);
        
        // Xóa toàn bộ cache liên quan (cả id, slug và danh sách)
        await this.clearProductCaches(id, p.slug || undefined);
      }
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
