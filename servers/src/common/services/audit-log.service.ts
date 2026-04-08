import { Injectable, Logger } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';

type AuditAction = 'USER_CREATE' | 'USER_UPDATE' | 'USER_DEACTIVATE' | 'USER_SOFT_DELETE' | 'USER_DELETE_BLOCKED';

interface AuditPayload {
  action: AuditAction;
  actorId?: number | null;
  targetUserId?: number | null;
  details?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  async write(payload: AuditPayload): Promise<void> {
    try {
      const logDir = path.resolve(process.cwd(), 'logs');
      const logFile = path.join(logDir, 'audit.log');
      await mkdir(logDir, { recursive: true });

      const line = JSON.stringify({
        timestamp: new Date().toISOString(),
        ...payload,
      });

      await appendFile(logFile, `${line}\n`, 'utf8');
    } catch (error) {
      this.logger.error(`Failed to write audit log: ${(error as Error).message}`);
    }
  }
}
