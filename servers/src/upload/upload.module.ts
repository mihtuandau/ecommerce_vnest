import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { multerConfig } from './multer.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,  
    MulterModule.register(multerConfig),
  ],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService], 
})
export class UploadModule {}





