import { 
  Controller, Get, Post, Put, Delete, Body, Param, Query, Request,
  UseGuards, UseInterceptors, UploadedFiles, BadRequestException, HttpCode, HttpStatus
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
import { Permissions } from '../common/decorators/permissions.decorator';

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
  findOne(@Param('id') id: string, @Query('allVariants') allVariants?: string) {
    return this.productService.findOne(id, allVariants === 'true');
  }

  @Get(':id/related')
  getRelated(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.productService.getRelatedProducts(+id, limit ? +limit : 8);
  }

  @Post(':id/view')
  @HttpCode(HttpStatus.NO_CONTENT)
  incrementView(@Param('id') id: string, @Request() req: any) {

    const identifier = req.user?.userId || req.ip || req.connection.remoteAddress || 'anonymous';
    return this.productService.incrementViewCount(+id, identifier);
  }

  @Post()
  @Permissions('product.manage')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  @Permissions('product.manage')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @Permissions('product.manage')
  remove(@Param('id') id: string, @Body() deleteProductDto: DeleteProductDto) {
    if (!deleteProductDto.confirm) {
      throw new Error('Confirm deletion required');
    }
    return this.productService.remove(+id);
  }

  @Post(':id/variant')
  @Permissions('product.manage')
  createVariant(@Param('id') id: string, @Body() createVariantDto: CreateVariantDto) {
    createVariantDto.productId = +id;
    return this.productService.createVariant(createVariantDto);
  }

  @Put('variant/:variantId')
  @Permissions('product.manage')
  updateVariant(@Param('variantId') variantId: string, @Body() body: any) {
    return this.productService.updateVariant(+variantId, body);
  }

  @Delete('variant/:variantId')
  @Permissions('product.manage')
  removeVariant(@Param('variantId') variantId: string) {
    return this.productService.deleteVariant(+variantId);
  }

  
  @Post(':id/images')
  @Permissions('product.manage')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadProductImages(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('altText') altText?: string,
    @Body('isThumbnail') isThumbnail?: string,
    @Body('displayOrder') displayOrder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file ảnh');
    }

    const isThumbnailBool = isThumbnail === 'true';
    const displayOrderNum = displayOrder ? parseInt(displayOrder, 10) : 0;

    return this.productService.uploadProductImages(+id, files, {
      altText,
      isThumbnail: isThumbnailBool,
      displayOrder: displayOrderNum,
    });
  }

  
  @Post('variant/:variantId/images')
  @Permissions('product.manage')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadVariantImages(
    @Param('variantId') variantId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('altText') altText?: string,
    @Body('isPrimary') isPrimary?: string,
    @Body('displayOrder') displayOrder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Vui lòng chọn ít nhất 1 file ảnh');
    }

    const isPrimaryBool = isPrimary === 'true';
    const displayOrderNum = displayOrder ? parseInt(displayOrder, 10) : 0;

    return this.productService.uploadVariantImages(+variantId, files, {
      altText,
      isPrimary: isPrimaryBool,
      displayOrder: displayOrderNum,
    });
  }

  
  @Delete('images/:imageId')
  @Permissions('product.manage')
  async deleteProductImage(@Param('imageId') imageId: string) {
    return this.productService.deleteProductImage(+imageId);
  }

  
  @Delete('variant-images/:imageId')
  @Permissions('product.manage')
  async deleteVariantImage(@Param('imageId') imageId: string) {
    return this.productService.deleteVariantImage(+imageId);
  }
}







