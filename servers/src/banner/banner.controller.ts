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
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Banner image file'
        },
        title: {
          type: 'string',
          example: 'Summer Sale 2024'
        },
        subtitle: {
          type: 'string',
          example: 'Giảm giá lên đến 50%'
        },
        video: {
          type: 'string',
          example: 'https://example.com/video.mp4'
        },
        link: {
          type: 'string',
          example: '/products/sale'
        },
        buttonText: {
          type: 'string',
          example: 'Mua ngay'
        },
        isActive: {
          type: 'boolean',
          example: true
        },
        displayOrder: {
          type: 'number',
          example: 1
        }
      },
      required: ['image', 'title']
    }
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any
  ) {

    const imageUrls = await this.uploadService.uploadImages([file]);

    const createBannerDto: CreateBannerDto = {
      title: body.title,
      subtitle: body.subtitle,
      image: imageUrls[0],
      video: body.video,
      link: body.link || '/products',
      buttonText: body.buttonText || 'Mua ngay',
      isActive: body.isActive === 'true' || body.isActive === true,
      displayOrder: body.displayOrder ? parseInt(body.displayOrder) : (body.order ? parseInt(body.order) : 0)
    };
    
    return this.bannerService.create(createBannerDto);
  }

  @Post('upload-image')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload'
        }
      },
      required: ['file']
    }
  })
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
          description: 'Banner image file (optional)'
        },
        title: {
          type: 'string',
          example: 'Summer Sale 2024'
        },
        subtitle: {
          type: 'string',
          example: 'Giảm giá lên đến 50%'
        },
        video: {
          type: 'string',
          example: 'https://example.com/video.mp4'
        },
        link: {
          type: 'string',
          example: '/products/sale'
        },
        buttonText: {
          type: 'string',
          example: 'Mua ngay'
        },
        isActive: {
          type: 'boolean',
          example: true
        },
        displayOrder: {
          type: 'number',
          example: 1
        }
      }
    }
  })
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
      displayOrder: body.displayOrder ? parseInt(body.displayOrder) : (body.order ? parseInt(body.order) : undefined)
    };

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
  reorder(@Param('id') id: string, @Body('order') displayOrder: number) {
    return this.bannerService.reorder(+id, displayOrder);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth('Authorization')
  remove(@Param('id') id: string) {
    return this.bannerService.remove(+id);
  }
}








