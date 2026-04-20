import { ConfigService } from '@nestjs/config';

export const cloudinaryConfig = (configService: ConfigService) => ({
  cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
  api_key: configService.get('CLOUDINARY_API_KEY'),
  api_secret: configService.get('CLOUDINARY_API_SECRET'),
});





