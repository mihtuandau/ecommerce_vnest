import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.ProductCreateInput) {
    return this.prisma.product.create({ 
      data, 
      include: { 
        category: { select: { id: true, name: true, slug: true } }, 
        brand: { select: { id: true, name: true } }, 
        variants: { include: { images: true } }, 
        images: true 
      } 
    });
  }

  async findAll(where: Prisma.ProductWhereInput, skip: number, take: number, orderBy?: any) {
    return this.prisma.product.findMany({
      where, skip, take, orderBy,
      select: {
        id: true, 
        name: true, 
        slug: true, 
        basePrice: true, 
        originalPrice: true, 
        soldCount: true,
        averageRating: true, 
        reviewCount: true, 
        isActive: true,
        category: { select: { name: true } },
        images: { 
          where: { isThumbnail: true }, 
          take: 1, 
          select: { url: true } 
        },
        variants: { 
          where: { isActive: true, deletedAt: null },
          take: 1,
          select: { stock: true } 
        }
      }
    });
  }

  async count(where: Prisma.ProductWhereInput) { return this.prisma.product.count({ where }); }

  async findByIdOrSlug(idOrSlug: number | string, includeAllVariants = false) {
    const isNum = typeof idOrSlug === 'number' || !isNaN(Number(idOrSlug));
    const variantArgs: any = includeAllVariants 
      ? { include: { images: { orderBy: { displayOrder: 'asc' } } } } 
      : { 
          where: { isActive: true, deletedAt: null }, 
          select: { 
            id: true, size: true, color: true, stock: true, price: true, originalPrice: true, sku: true, isActive: true, 
            images: { select: { id: true, url: true, isPrimary: true }, orderBy: { displayOrder: 'asc' } } 
          } 
        };
    
    return this.prisma.product.findFirst({
      where: isNum 
        ? { id: Number(idOrSlug), deletedAt: null } 
        : { slug: idOrSlug as string, deletedAt: null },
      select: {
        id: true, name: true, slug: true, description: true, basePrice: true, originalPrice: true, categoryId: true, brandId: true,
        soldCount: true, averageRating: true, reviewCount: true, viewCount: true, isActive: true,
        metaTitle: true, metaDesc: true, createdAt: true, updatedAt: true,
        category: { select: { id: true, name: true } }, brand: { select: { id: true, name: true, logo: true } },
        variants: variantArgs, images: { orderBy: { displayOrder: 'asc' } },
        reviews: { orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { id: true, name: true } } } }
      }
    });
  }

  async findById(id: number) { 
    return this.findByIdOrSlug(id, true); 
  }

  async update(id: number, data: Prisma.ProductUpdateInput) {
    return this.prisma.product.update({ 
      where: { id }, 
      data, 
      include: { 
        category: { select: { id: true, name: true, slug: true } }, 
        brand: { select: { id: true, name: true } }, 
        variants: { include: { images: true } }, 
        images: true 
      } 
    });
  }

  async delete(id: number) { 
    return this.prisma.product.update({ 
      where: { id }, 
      data: { 
        deletedAt: new Date(),
        isActive: false,
        variants: {
          updateMany: {
            where: { productId: id },
            data: { deletedAt: new Date(), isActive: false }
          }
        }
      } 
    }); 
  }

  async findVariantById(id: number) { return this.prisma.productVariant.findUnique({ where: { id }, include: { product: true, images: true } }); }
  async createImages(images: any[]) { return this.prisma.productImage.createMany({ data: images }); }
  async createVariantImages(images: any[]) { return this.prisma.variantImage.createMany({ data: images }); }
  async deleteImages(ids: number[]) { return this.prisma.productImage.deleteMany({ where: { id: { in: ids } } }); }
  async deleteVariantImages(ids: number[]) { return this.prisma.variantImage.deleteMany({ where: { id: { in: ids } } }); }
  
  async findImagesByProductId(productId: number) {
    return this.prisma.productImage.findMany({ where: { productId } });
  }

  async findImagesByVariantId(variantId: number) {
    return this.prisma.variantImage.findMany({ where: { variantId } });
  }
  
  async deleteImagesByProductId(productId: number) {
    return this.prisma.productImage.deleteMany({ where: { productId } });
  }

  async deleteVariantsByProductId(productId: number) {
    return this.prisma.productVariant.deleteMany({ where: { productId } });
  }
  
  async updateThumbnailStatus(pId: number, isThumbnail: boolean) { return this.prisma.productImage.updateMany({ where: { productId: pId }, data: { isThumbnail } }); }
  async updateVariantPrimaryStatus(vId: number, isPrimary: boolean) { return this.prisma.variantImage.updateMany({ where: { variantId: vId }, data: { isPrimary } }); }

  async createVariant(data: any) { return this.prisma.productVariant.create({ data }); }
  async updateVariant(id: number, data: any) { return this.prisma.productVariant.update({ where: { id }, data }); }
  async deleteVariant(id: number) { 
    return this.prisma.productVariant.update({ 
      where: { id }, 
      data: { 
        deletedAt: new Date(),
        isActive: false 
      } 
    }); 
  }

  async findVariantImageById(id: number) { return this.prisma.variantImage.findUnique({ where: { id } }); }
  async findImageById(id: number) { return this.prisma.productImage.findUnique({ where: { id } }); }

  async incrementViewCount(id: number) { return this.prisma.product.update({ where: { id }, data: { viewCount: { increment: 1 } } }); }
  async incrementSoldCount(id: number, qty: number) { return this.prisma.product.update({ where: { id }, data: { soldCount: { increment: qty } } }); }
  
  async findRelated(id: number, catId: number | null, take: number) {
    return this.prisma.product.findMany({
      where: { id: { not: id }, categoryId: catId, isActive: true, deletedAt: null },
      take, orderBy: { soldCount: 'desc' },
      select: { id: true, name: true, slug: true, basePrice: true, images: { take: 1, select: { url: true } } }
    });
  }

  async getPriceRange() {
    const res = await this.prisma.productVariant.aggregate({ 
      where: { deletedAt: null, product: { deletedAt: null } },
      _min: { price: true }, 
      _max: { price: true } 
    });
    return { minPrice: res._min.price || 0, maxPrice: res._max.price || 100000000 };
  }
}
