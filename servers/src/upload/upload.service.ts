import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { cloudinaryConfig } from 'src/config/cloudinary.config';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config(cloudinaryConfig(this.configService));
  }

  async uploadImages(files: Express.Multer.File[]): Promise<string[]> {  
    const urls = await Promise.all(
      files.map(file =>
        new Promise<string>((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: 'auto', 
              folder: 'ecommerce/products'
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result!.secure_url);
            },
          ).end(file.buffer);
        }),
      ),
    );
    return urls;
  }
}





