import { MulterModuleOptions } from '@nestjs/platform-express/multer';

export const multerConfig: MulterModuleOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },  
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'), false);
    }
  },
};