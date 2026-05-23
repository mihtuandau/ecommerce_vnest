import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SystemSettingsService } from '../../system-settings/system-settings.service';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(private readonly settingsService: SystemSettingsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const url = req.url;

    if (url.includes('/health') || url.includes('/system-settings')) {
      return true;
    }

    const settings = await this.settingsService.getSettings();
    const isMaintenance = settings?.maintenanceMode ?? false;

    if (!isMaintenance) {
      return true;
    }

    let isAdmin = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const payloadBase64 = token.split('.')[1];
        const decodedJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const decoded = JSON.parse(decodedJson);
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
