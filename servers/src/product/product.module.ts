import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductRepository } from './product.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { UploadService } from '../upload/upload.service';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [PrismaModule, CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, UploadService],
  exports: [ProductService],
})
export class ProductModule {}
