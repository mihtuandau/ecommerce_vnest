import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, 
  UseGuards, UseInterceptors, UploadedFiles, BadRequestException 
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ProductService } from './product.service';
import { QueryProductDto } from './dto/query-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVariantDto } from './dto/create-variant.dto';
import { DeleteProductDto } from './dto/delete-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerConfig } from '../upload/multer.config';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get('price-range')
  getPriceRange() {
    return this.productService.getPriceRange();
  }

  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Post()
  @Roles('ADMIN')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Body() deleteProductDto: DeleteProductDto) {
    if (!deleteProductDto.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.productService.remove(+id);
  }

  @Post(':id/variant')
  @Roles('ADMIN')
  createVariant(@Param('id') id: string, @Body() createVariantDto: CreateVariantDto) {
    createVariantDto.productId = +id;
    return this.productService.createVariant(createVariantDto);
  }

  @Put('variant/:variantId')
  @Roles('ADMIN')
  updateVariant(@Param('variantId') variantId: string, @Body() body: any) {
    return this.productService.updateVariant(+variantId, body);
  }

  @Delete('variant/:variantId')
  @Roles('ADMIN')
  removeVariant(@Param('variantId') variantId: string) {
    return this.productService.deleteVariant(+variantId);
  }

  @Post(':id/images')
  @Roles('ADMIN')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('altText') altText?: string,
    @Body('isThumbnail') isThumbnail?: string,
    @Body('variantId') variantId?: string
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file ảnh');
    }

    const isThumbnailBool = isThumbnail === 'true';
    const variantIdNum = variantId ? parseInt(variantId, 10) : undefined;

    return this.productService.uploadProductImages(+id, files, {
      altText,
      isThumbnail: isThumbnailBool,
      variantId: variantIdNum,
    });
  }

  @Delete('images/:imageId')
  @Roles('ADMIN')
  async deleteProductImage(@Param('imageId') imageId: string) {
    return this.productService.deleteProductImage(+imageId);
  }
}

