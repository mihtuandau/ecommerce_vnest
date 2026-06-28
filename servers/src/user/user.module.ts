import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuditLogController } from './audit-log.controller';
import { UserRepository } from './user.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditLogService } from '../common/services/audit-log.service';

import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [UserController, AuditLogController],
  providers: [UserService, UserRepository, AuditLogService],
  exports: [UserService],
})
export class UserModule {}
