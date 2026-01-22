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
   * Create product images (for Product only)
   */
  async createImages(images: Prisma.ProductImageCreateManyInput[]) {
    return this.prisma.productImage.createMany({
      data: images,
    });
  }

  /**
   * Create variant images (for ProductVariant only)
   */
  async createVariantImages(images: Prisma.VariantImageCreateManyInput[]) {
    return this.prisma.variantImage.createMany({
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
   * Delete variant images
   */
  async deleteVariantImages(imageIds: number[]) {
    return this.prisma.variantImage.deleteMany({
      where: { id: { in: imageIds } },
    });
  }

  /**
   * Update image thumbnail status for ProductImage
   */
  async updateThumbnailStatus(productId: number, isThumbnail: boolean) {
    return this.prisma.productImage.updateMany({
      where: { productId },
      data: { isThumbnail },
    });
  }

  /**
   * Update primary image status for VariantImage
   */
  async updateVariantPrimaryStatus(variantId: number, isPrimary: boolean) {
    return this.prisma.variantImage.updateMany({
      where: { variantId },
      data: { isPrimary },
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
   * Find images by variant ID (VariantImage only)
   */
  async findVariantImages(variantId: number) {
    return this.prisma.variantImage.findMany({
      where: { variantId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Find images by product ID (ProductImage only)
   */
  async findProductImages(productId: number) {
    return this.prisma.productImage.findMany({
      where: { productId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  /**
   * Find ProductImage by ID
   */
  async findImageById(imageId: number) {
    return this.prisma.productImage.findUnique({
      where: { id: imageId },
    });
  }

  /**
   * Find VariantImage by ID
   */
  async findVariantImageById(imageId: number) {
    return this.prisma.variantImage.findUnique({
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
   * Get price range (min and max) from all product variants
   */
  async getPriceRange() {
    const result = await this.prisma.productVariant.aggregate({
      _min: {
        price: true,
      },
      _max: {
        price: true,
      },
    });

    return {
      minPrice: result._min.price || 0,
      maxPrice: result._max.price || 100000000,
    };
  }
}
