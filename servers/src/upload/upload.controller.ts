import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { multerConfig } from './multer.config';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {  // Fix: Full type Express.Multer.File[]
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadImages(files);
    return { urls, message: 'Upload successful' };
  }
}

