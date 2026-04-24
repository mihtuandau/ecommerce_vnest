import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from '../config/cloudinary.config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config(cloudinaryConfig(this.configService));
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {  
    try {
      const urls = await Promise.all(
        files.map(file =>
          new Promise<string>((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
              { 
                resource_type: 'auto', 
                folder: 'ecommerce/products'
              },
              (error, result) => {
                if (error) {
                  console.error('Cloudinary Error:', error);
                  reject(error);
                }
                else resolve(result!.secure_url);
              },
            );
            upload.end(file.buffer);
          }),
        ),
      );
      return urls;
    } catch (error) {
      console.error('UploadService Error:', error);
      throw error;
    }
  }
}





