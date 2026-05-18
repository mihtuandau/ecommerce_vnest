import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface SystemSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  shippingFee: number;
  freeShippingThreshold: number;
  maintenanceMode: boolean;
  stockAlert: boolean;
  orderNotification: boolean;
}

@Injectable()
export class SystemSettingsService {
  private readonly logger = new Logger(SystemSettingsService.name);
  private readonly filePath = path.join(process.cwd(), 'data', 'system-settings.json');

  private readonly defaultSettings: SystemSettings = {
    storeName: 'LUXE E-Commerce',
    storeEmail: 'contact@luxe.vn',
    storePhone: '1900 1234',
    storeAddress: 'Minh Tuấn Shop, Hà Nội',
    shippingFee: 30000,
    freeShippingThreshold: 500000,
    maintenanceMode: false,
    stockAlert: true,
    orderNotification: true,
  };

  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists() {
    const dirPath = path.dirname(this.filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    if (!fs.existsSync(this.filePath)) {
      this.writeSettings(this.defaultSettings);
      this.logger.log('Created default system settings file.');
    }
  }

  private readSettings(): SystemSettings {
    try {
      if (!fs.existsSync(this.filePath)) {
        return this.defaultSettings;
      }
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return { ...this.defaultSettings, ...JSON.parse(data) };
    } catch (error) {
      this.logger.error('Failed to read system settings, using defaults.', error);
      return this.defaultSettings;
    }
  }

  private writeSettings(settings: SystemSettings) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(settings, null, 2), 'utf-8');
    } catch (error) {
      this.logger.error('Failed to write system settings.', error);
    }
  }

  async getSettings(): Promise<SystemSettings> {
    return this.readSettings();
  }

  async updateSettings(dto: Partial<SystemSettings>): Promise<SystemSettings> {
    const current = this.readSettings();
    const updated = {
      ...current,
      ...dto,
      // Parse numbers if they come as string
      shippingFee: dto.shippingFee !== undefined ? Number(dto.shippingFee) : current.shippingFee,
      freeShippingThreshold: dto.freeShippingThreshold !== undefined ? Number(dto.freeShippingThreshold) : current.freeShippingThreshold,
    };
    this.writeSettings(updated);
    this.logger.log('System settings updated successfully.');
    return updated;
  }
}
