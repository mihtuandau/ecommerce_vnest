import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CategoryService } from './category.service';
import { UploadService } from '../upload/upload.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Permissions } from '../common/decorators/permissions.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private uploadService: UploadService,
  ) {}

  @Get()
  findAll(@Query('tree') tree?: string) {
    return this.categoryService.findAll(tree === 'true');
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('category.manage')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    const createCategoryDto: CreateCategoryDto = {
      name: body.name,
      parentId: body.parentId ? Number(body.parentId) : undefined,
    };

    if (file) {
      const imageUrls = await this.uploadService.uploadImages([file]);
      createCategoryDto.image = imageUrls[0];
    }

    return this.categoryService.create(createCategoryDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('category.manage')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    const updateCategoryDto: UpdateCategoryDto = {
      name: body.name,
      parentId:
        body.parentId !== undefined
          ? body.parentId
            ? Number(body.parentId)
            : null
          : undefined,
    };

    if (file) {
      const imageUrls = await this.uploadService.uploadImages([file]);
      updateCategoryDto.image = imageUrls[0];
    }

    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('category.manage')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const urls = await this.uploadService.uploadImages([file]);
    return { url: urls[0] };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('category.manage')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
