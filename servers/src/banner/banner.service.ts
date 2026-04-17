import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Banner } from '@prisma/client';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@Injectable()
export class BannerService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateBannerDto): Promise<Banner> {
    return this.prisma.banner.create({ data });
  }

  async findAll(activeOnly: boolean = false): Promise<Banner[]> {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.banner.findMany({ 
      where,
      orderBy: { order: 'asc' }
    });
  }

  async findOne(id: number): Promise<Banner> {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    if (!banner) {
      throw new NotFoundException(`Banner with ID ${id} not found`);
    }
    return banner;
  }

  async update(id: number, data: UpdateBannerDto): Promise<Banner> {
    await this.findOne(id); 
    return this.prisma.banner.update({ where: { id }, data });
  }

  async remove(id: number): Promise<Banner> {
    await this.findOne(id); 
    return this.prisma.banner.delete({ where: { id } });
  }

  async reorder(bannerId: number, newOrder: number): Promise<Banner> {
    await this.findOne(bannerId);
    return this.prisma.banner.update({
      where: { id: bannerId },
      data: { order: newOrder }
    });
  }
}






