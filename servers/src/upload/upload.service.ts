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
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const upload = cloudinary.uploader.upload_stream(
                {
                  resource_type: 'auto',
                  folder: 'ecommerce/products',
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary Error:', error);
                    reject(error);
                  } else resolve(result!.secure_url);
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

  async deleteImage(url: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567/ecommerce/products/image_id.jpg
      const parts = url.split('/');
      const fileName = parts[parts.length - 1];
      const publicIdWithExtension = parts
        .slice(parts.indexOf('ecommerce'))
        .join('/');
      const publicId = publicIdWithExtension.split('.')[0];

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image from Cloudinary:', error);
    }
  }
}
