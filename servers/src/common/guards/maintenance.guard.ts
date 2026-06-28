import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SystemSettingsService } from '../../system-settings/system-settings.service';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private readonly settingsService: SystemSettingsService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const path = req.path;

    if (path.includes('/health') || path.includes('/system-settings')) {
      return true;
    }

    const settings = await this.settingsService.getSettings();
    const isMaintenance = settings?.maintenanceMode ?? false;

    if (!isMaintenance) {
      return true;
    }

    const authHeader = req.headers.authorization;
    const bearerToken =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;
    const token = bearerToken || req.cookies?.accessToken;
    let isAdmin = false;

    if (token) {
      try {
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET,
        });
        isAdmin = decoded?.role === 'ADMIN';
      } catch (e) {}
    }

    if (isAdmin) {
      return true;
    }

    throw new ServiceUnavailableException({
      statusCode: 503,
      error: 'MAINTENANCE_MODE',
      message: settings.maintenanceMessage,
    });
  }
}
