import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { ProductRepository } from './product.repository';
import { UploadService } from '../upload/upload.service';
import { buildCacheKey } from '../common/utils/cache-key.util';

@Injectable()
export class ProductService {
  constructor(private repo: ProductRepository, @Inject(CACHE_MANAGER) private cache: Cache, private uploadService: UploadService) {}

  async create(data: any) { await this.cache.del('products:all'); return this.repo.create(data); }

  async findAll(q: any) {
    const key = buildCacheKey('products', q);
    const cached = await this.cache.get(key);
    if (cached) return cached;
    const { page = 1, limit = 10, search, categoryId, brandId, minPrice, maxPrice, minRating, sortBy = 'newest', status, inStock, outOfStock } = q;
    const where: any = {};
    if (search) where.name = { contains: search, mode: 'insensitive' };
    if (categoryId) where.categoryId = categoryId;
    if (brandId) where.brandId = brandId;
    if (minPrice || maxPrice) where.basePrice = { gte: minPrice, lte: maxPrice };
    if (minRating) where.averageRating = { gte: minRating };
    if (status) where.isActive = status === 'active';
    if (inStock) where.variants = { some: { stock: { gt: 0 } } };
    if (outOfStock) where.variants = { every: { stock: { lte: 0 } } };
    const sortMap = { 'price-asc': { basePrice: 'asc' }, 'price-desc': { basePrice: 'desc' }, 'name-asc': { name: 'asc' }, 'sold': { soldCount: 'desc' }, 'rating': { averageRating: 'desc' } };
    const [total, products] = await Promise.all([this.repo.count(where), this.repo.findAll(where, (page - 1) * limit, limit, sortMap[sortBy] || { createdAt: 'desc' })]);
    const res = { data: products, page, limit, total, totalPages: Math.ceil(total / limit) };
    await this.cache.set(key, res, 3600);
    return res;
  }

  async findOne(id: any, full = false) {
    if (full) return this.repo.findByIdOrSlug(id, true);
    const cached = await this.cache.get(`product:${id}`);
    if (cached) return cached;
    const p = await this.repo.findByIdOrSlug(id, false);
    if (p) await this.cache.set(`product:${id}`, p, 1800);
    return p;
  }

  async update(id: number, data: any) {
    const { status, ...rest } = data;
    const p = await this.repo.update(id, { ...rest, isActive: status !== undefined ? status === 'active' : undefined });
    await Promise.all([this.cache.del('products:all'), this.cache.del(`product:${id}`)]);
    return p;
  }

  async remove(id: number) {
    const p = await this.repo.delete(id);
    await Promise.all([this.cache.del('products:all'), this.cache.del(`product:${id}`)]);
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
    const urls = await this.uploadService.uploadImages(files);
    if (meta.isThumbnail) await this.repo.updateThumbnailStatus(id, false);
    await this.repo.createImages(urls.map((u, i) => ({ productId: id, url: u, isThumbnail: meta.isThumbnail && i === 0, displayOrder: (meta.displayOrder || 0) + i })));
    await this.cache.del(`product:${id}`);
    return { urls };
  }

  async uploadVariantImages(vId: number, files: any[], meta: any) {
    const v = await this.repo.findVariantById(vId);
    if (!v) throw new NotFoundException();
    const urls = await this.uploadService.uploadImages(files);
    await this.repo.createVariantImages(urls.map((u, i) => ({ variantId: vId, url: u, isPrimary: meta.isPrimary && i === 0, displayOrder: (meta.displayOrder || 0) + i })));
    await this.cache.del(`product:${v.productId}`);
    return { urls };
  }

  async deleteProductImage(id: number) {
    const img = await this.repo.findImageById(id);
    if (!img) throw new NotFoundException();
    await this.repo.deleteImages([id]);
    await this.cache.del(`product:${img.productId}`);
    return { id };
  }

  async deleteVariantImage(id: number) {
    const img = await this.repo.findVariantImageById(id);
    if (!img) throw new NotFoundException();
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
    return this.repo.findRelated(p.id, p.categoryId, limit);
  }

  async getPriceRange() { return this.repo.getPriceRange(); }
}
