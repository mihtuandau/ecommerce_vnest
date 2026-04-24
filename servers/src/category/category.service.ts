import { Injectable } from '@nestjs/common';
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
      data: { ...data, slug } 
    });
  }

  async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany({ 
      include: { 
        _count: {
          select: { 
            products: {
              where: { deletedAt: null } // Only count non-deleted products
            }
          }
        }
      } 
    });
  }

  async findOne(id: number): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id }, include: { products: true } });
  }

  async update(id: number, data: UpdateCategoryDto): Promise<Category> {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = this.slugify(data.name);
    }
    return this.prisma.category.update({ where: { id }, data: updateData });
  }

  async remove(id: number): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}





