import { MulterModuleOptions } from '@nestjs/platform-express/multer';

export const multerConfig: MulterModuleOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
    const isImageMime = file.mimetype.startsWith('image/');
    const isAllowedExt = allowedExtensions.test(file.originalname);

    if (isImageMime && isAllowedExt) {
      cb(null, true);
    } else {
      cb(
        new Error('Only image files (jpg, jpeg, png, gif, webp) are allowed'),
        false,
      );
    }
  },
};
