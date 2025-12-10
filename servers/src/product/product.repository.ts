import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';

/**
 * Repository pattern for Product data access
 * Handles all database queries related to products
 */
@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new product
   */
  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.prisma.product.create({
      data,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
    });
  }

  /**
   * Find all products with filters
   */
  async findAll(
    where: Prisma.ProductWhereInput,
    skip: number,
    take: number,
    orderBy?: Prisma.ProductOrderByWithRelationInput,
  ) {
    return this.prisma.product.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
    });
  }

  /**
   * Count products with filters
   */
  async count(where: Prisma.ProductWhereInput): Promise<number> {
    return this.prisma.product.count({ where });
  }

  /**
   * Find product by ID
   */
  async findById(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        variants: {
          include: {
            images: true,
          },
        },
        images: true,
        reviews: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  }

  /**
   * Update product
   */
  async update(id: number, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
    });
  }

  /**
   * Delete product
   */
  async delete(id: number): Promise<Product> {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  /**
   * Update product variants
   */
  async updateVariants(productId: number, variants: any[]) {
    // Delete existing variants
    await this.prisma.productVariant.deleteMany({
      where: { productId },
    });

    // Create new variants
    return this.prisma.productVariant.createMany({
      data: variants.map((v) => ({
        ...v,
        productId,
      })),
    });
  }

  /**
   * Find variant by ID
   */
  async findVariantById(variantId: number) {
    return this.prisma.productVariant.findUnique({
      where: { id: variantId },
      include: {
        product: true,
        images: true,
      },
    });
  }

  /**
   * Create product images
   */
  async createImages(images: Prisma.ProductImageCreateManyInput[]) {
    return this.prisma.productImage.createMany({
      data: images,
    });
  }

  /**
   * Delete product images
   */
  async deleteImages(imageIds: number[]) {
    return this.prisma.productImage.deleteMany({
      where: { id: { in: imageIds } },
    });
  }

  /**
   * Update image thumbnail status
   */
  async updateThumbnailStatus(
    productId: number,
    variantId: number | null,
    isThumbnail: boolean,
  ) {
    const where: any = { productId };
    if (variantId !== null) {
      where.variantId = variantId;
    } else {
      where.variantId = null;
    }

    return this.prisma.productImage.updateMany({
      where,
      data: { isThumbnail },
    });
  }

  /**
   * Search products
   */
  async search(searchTerm: string, skip: number, take: number) {
    return this.prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      skip,
      take,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
    });
  }

  /**
   * Get related products
   */
  async findRelatedProducts(categoryId: number, excludeId: number, limit: number) {
    return this.prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
      },
      take: limit,
      include: {
        category: true,
        brand: true,
        variants: true,
        images: true,
      },
    });
  }

  /**
   * Create a product variant
   */
  async createVariant(data: Prisma.ProductVariantCreateInput) {
    return this.prisma.productVariant.create({ data });
  }

  /**
   * Update a product variant
   */
  async updateVariant(variantId: number, data: Prisma.ProductVariantUpdateInput) {
    return this.prisma.productVariant.update({
      where: { id: variantId },
      data,
    });
  }

  /**
   * Delete a product variant
   */
  async deleteVariant(variantId: number) {
    return this.prisma.productVariant.delete({
      where: { id: variantId },
    });
  }

  /**
   * Find images by variant ID
   */
  async findImagesByVariant(variantId: number) {
    return this.prisma.productImage.findMany({
      where: { variantId },
    });
  }

  /**
   * Find image by ID
   */
  async findImageById(imageId: number) {
    return this.prisma.productImage.findUnique({
      where: { id: imageId },
    });
  }

  /**
   * Increment product sold count
   */
  async incrementSoldCount(productId: number, quantity: number) {
    return this.prisma.product.update({
      where: { id: productId },
      data: {
        soldCount: {
          increment: quantity,
        },
      },
    });
  }

  /**
   * Get price range of all products
   */
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
}
