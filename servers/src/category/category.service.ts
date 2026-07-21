import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

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

  async create(data: CreateCategoryDto): Promise<Category> {
    const slug = this.slugify(data.name);
    return this.prisma.category.create({
      data: {
        ...data,
        slug,
        parentId: data.parentId ? Number(data.parentId) : null,
      },
    });
  }

  async findAll(tree = false): Promise<any[]> {
    if (tree) {
      return this.getCategoryTree();
    }

    return this.prisma.category.findMany({
      include: {
        parent: {
          select: { id: true, name: true },
        },
        _count: {
          select: {
            products: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });
  }

  async getCategoryTree(): Promise<any[]> {
    const allCategories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: { deletedAt: null },
            },
          },
        },
      },
    });

    const buildTree = (parentId: number | null = null): any[] => {
      return allCategories
        .filter((cat) => cat.parentId === parentId)
        .map((cat) => ({
          ...cat,
          children: buildTree(cat.id),
        }));
    };

    return buildTree(null);
  }

  async getChildIds(parentId: number): Promise<number[]> {
    const allCategories = await this.prisma.category.findMany({
      select: { id: true, parentId: true },
    });

    const ids: number[] = [parentId];
    const visited = new Set<number>([parentId]);
    const findChildren = (pid: number) => {
      const children = allCategories.filter((cat) => cat.parentId === pid);
      for (const child of children) {
        // Guard chống vòng lặp vô hạn nếu dữ liệu đã bị lệch thành chu trình
        if (visited.has(child.id)) continue;
        visited.add(child.id);
        ids.push(child.id);
        findChildren(child.id);
      }
    };

    findChildren(parentId);
    return ids;
  }

  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        products: {
          where: { deletedAt: null },
        },
      },
    });
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = this.slugify(data.name);
    }
    if (data.parentId !== undefined) {
      const newParentId = data.parentId ? Number(data.parentId) : null;

      if (newParentId !== null) {
        if (newParentId === id) {
          throw new BadRequestException(
            'Danh mục không thể là cha của chính nó',
          );
        }
        // Ngăn set cha là hậu duệ của chính nó (tạo vòng lặp vô hạn khi duyệt cây)
        const descendantIds = await this.getChildIds(id);
        if (descendantIds.includes(newParentId)) {
          throw new BadRequestException(
            'Không thể chọn một danh mục con làm danh mục cha (sẽ tạo vòng lặp)',
          );
        }
      }

      updateData.parentId = newParentId;
    }
    return this.prisma.category.update({ where: { id }, data: updateData });
  }

  async remove(id: number): Promise<Category> {
    // Check if category has children before deleting or handle cascade
    const childrenCount = await this.prisma.category.count({
      where: { parentId: id },
    });
    if (childrenCount > 0) {
      // Option 1: Prevent deletion
      // throw new Error('Cannot delete category with sub-categories');

      // Option 2: Set children's parent to null (orphan)
      await this.prisma.category.updateMany({
        where: { parentId: id },
        data: { parentId: null },
      });
    }

    return this.prisma.category.delete({ where: { id } });
  }
}
