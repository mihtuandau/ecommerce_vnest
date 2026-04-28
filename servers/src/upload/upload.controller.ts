import { Controller, Post, UseInterceptors, UploadedFiles, BadRequestException, UseGuards } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { UploadService } from './upload.service';
import { multerConfig } from './multer.config';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {  
    console.log('Received files for upload:', files?.length);
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    const urls = await this.uploadService.uploadImages(files);
    return { urls, message: 'Upload successful' };
  }
}







