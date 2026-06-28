import { Injectable, Logger } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';
import { PrismaService } from '../../prisma/prisma.service';

type AuditAction =
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DEACTIVATE'
  | 'USER_SOFT_DELETE'
  | 'USER_DELETE_BLOCKED';

interface AuditPayload {
  action: AuditAction;
  actorId?: number | null;
  targetUserId?: number | null;
  details?: Record<string, unknown>;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(private prisma: PrismaService) {}

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
      this.logger.error(
        `Failed to write audit log: ${(error as Error).message}`,
      );
    }
  }

  async getLogs(params: {
    page?: number;
    limit?: number;
    action?: string;
    entityName?: string;
    userId?: number;
    search?: string;
  }) {
    const page = Number(params.page || 1);
    const limit = Number(params.limit || 20);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (params.action) {
      where.action = params.action;
    }

    if (params.entityName) {
      where.entityName = params.entityName;
    }

    if (params.userId) {
      where.userId = Number(params.userId);
    }

    if (params.search) {
      where.OR = [
        { action: { contains: params.search, mode: 'insensitive' } },
        { entityName: { contains: params.search, mode: 'insensitive' } },
        { entityId: { contains: params.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              avatar: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
