import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BannerService } from './banner.service';
import { UploadService } from '../upload/upload.service';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';

@ApiTags('Banners')
@Controller('banners')
export class BannerController {
  constructor(
    private bannerService: BannerService,
    private uploadService: UploadService
  ) {}

  @Get()
  findAll(@Query('active') active?: string) {
    const activeOnly = active === 'true';
    return this.bannerService.findAll(activeOnly);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bannerService.findOne(+id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    // Upload ảnh lên Cloudinary
    const imageUrls = await this.uploadService.uploadImages([file]);
    
    // Tạo banner với URL ảnh từ Cloudinary
    const createBannerDto: CreateBannerDto = {
      title: body.title,
      subtitle: body.subtitle,
      image: imageUrls[0],
      video: body.video,
      link: body.link,
      buttonText: body.buttonText || 'Mua ngay',
      isActive: body.isActive === 'true' || body.isActive === true,
      order: body.order ? parseInt(body.order) : 0
    };
    
    return this.bannerService.create(createBannerDto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    const urls = await this.uploadService.uploadImages([file]);
    return { url: urls[0] };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {
    const updateBannerDto: UpdateBannerDto = {
      title: body.title,
      subtitle: body.subtitle,
      video: body.video,
      link: body.link,
      buttonText: body.buttonText,
      isActive: body.isActive === 'true' || body.isActive === true,
      order: body.order ? parseInt(body.order) : undefined
    };

    // Nếu có upload ảnh mới, upload lên Cloudinary
    if (file) {
      const imageUrls = await this.uploadService.uploadImages([file]);
      updateBannerDto.image = imageUrls[0];
    }

    return this.bannerService.update(+id, updateBannerDto);
  }

  @Put(':id/reorder')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  reorder(@Param('id') id: string, @Body('order') order: number) {
    return this.bannerService.reorder(+id, order);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}


