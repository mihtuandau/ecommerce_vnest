import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export type PaymentEnvironment = 'test' | 'live';

export interface SystemSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeLogo: string;
  storeFavicon: string;
  shippingFee: number;
  freeShippingThreshold: number;
  shippingProvider: string;
  maintenanceMode: boolean;
  maintenanceMessage: string;
  stockAlert: boolean;
  orderNotification: boolean;
  emailNotification: boolean;
  soundNotification: boolean;
  codEnabled: boolean;
  vnpayEnabled: boolean;
  paymentEnvironment: PaymentEnvironment;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  defaultOgImage: string;
  autoCancelUnpaidMinutes: number;
  returnWindowDays: number;
}

@Injectable()
export class SystemSettingsService {
  private readonly logger = new Logger(SystemSettingsService.name);
  private readonly filePath = path.join(
    process.cwd(),
    'data',
    'system-settings.json',
  );

  private readonly defaultSettings: SystemSettings = {
    storeName: 'LUXE E-Commerce',
    storeEmail: 'contact@luxe.vn',
    storePhone: '1900 1234',
    storeAddress: 'LUXE Shop, Hà Nội',
    storeLogo: '',
    storeFavicon: '',
    shippingFee: 30000,
    freeShippingThreshold: 500000,
    shippingProvider: 'GHN',
    maintenanceMode: false,
    maintenanceMessage: 'Cửa hàng đang bảo trì. Vui lòng quay lại sau.',
    stockAlert: true,
    orderNotification: true,
    emailNotification: true,
    soundNotification: true,
    codEnabled: true,
    vnpayEnabled: true,
    paymentEnvironment: 'test',
    defaultMetaTitle: 'VNEST Store',
    defaultMetaDescription: 'Mua sắm sản phẩm chất lượng tại VNEST.',
    defaultOgImage: '',
    autoCancelUnpaidMinutes: 30,
    returnWindowDays: 7,
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
      return this.normalizeSettings(JSON.parse(data));
    } catch (error) {
      this.logger.error(
        'Failed to read system settings, using defaults.',
        error,
      );
      return this.defaultSettings;
    }
  }

  private writeSettings(settings: SystemSettings) {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.normalizeSettings(settings), null, 2),
        'utf-8',
      );
    } catch (error) {
      this.logger.error('Failed to write system settings.', error);
    }
  }

  private normalizeSettings(settings: Partial<SystemSettings>): SystemSettings {
    const merged = { ...this.defaultSettings, ...settings };

    return {
      ...merged,
      storeName: String(merged.storeName || this.defaultSettings.storeName),
      storeEmail: String(merged.storeEmail || this.defaultSettings.storeEmail),
      storePhone: String(merged.storePhone || this.defaultSettings.storePhone),
      storeAddress: String(
        merged.storeAddress || this.defaultSettings.storeAddress,
      ),
      storeLogo: String(merged.storeLogo || ''),
      storeFavicon: String(merged.storeFavicon || ''),
      shippingFee: Number(
        merged.shippingFee ?? this.defaultSettings.shippingFee,
      ),
      freeShippingThreshold: Number(
        merged.freeShippingThreshold ??
          this.defaultSettings.freeShippingThreshold,
      ),
      shippingProvider: String(
        merged.shippingProvider || this.defaultSettings.shippingProvider,
      ),
      maintenanceMode: Boolean(merged.maintenanceMode),
      maintenanceMessage: String(
        merged.maintenanceMessage || this.defaultSettings.maintenanceMessage,
      ),
      stockAlert: Boolean(merged.stockAlert),
      orderNotification: Boolean(merged.orderNotification),
      emailNotification: Boolean(merged.emailNotification),
      soundNotification: Boolean(merged.soundNotification),
      codEnabled: Boolean(merged.codEnabled),
      vnpayEnabled: Boolean(merged.vnpayEnabled),
      paymentEnvironment:
        merged.paymentEnvironment === 'live'
          ? 'live'
          : this.defaultSettings.paymentEnvironment,
      defaultMetaTitle: String(
        merged.defaultMetaTitle || this.defaultSettings.defaultMetaTitle,
      ),
      defaultMetaDescription: String(
        merged.defaultMetaDescription ||
          this.defaultSettings.defaultMetaDescription,
      ),
      defaultOgImage: String(merged.defaultOgImage || ''),
      autoCancelUnpaidMinutes: Number(
        merged.autoCancelUnpaidMinutes ??
          this.defaultSettings.autoCancelUnpaidMinutes,
      ),
      returnWindowDays: Number(
        merged.returnWindowDays ?? this.defaultSettings.returnWindowDays,
      ),
    };
  }

  async getSettings(): Promise<SystemSettings> {
    return this.readSettings();
  }

  async updateSettings(dto: Partial<SystemSettings>): Promise<SystemSettings> {
    const current = this.readSettings();
    const updated = this.normalizeSettings({
      ...current,
      ...dto,
    });

    this.writeSettings(updated);
    this.logger.log('System settings updated successfully.');
    return updated;
  }
}
