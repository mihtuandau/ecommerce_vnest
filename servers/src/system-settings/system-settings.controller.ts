import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import {
  SystemSettingsService,
  SystemSettings,
} from './system-settings.service';

@ApiTags('System Settings')
@Controller('system-settings')
export class SystemSettingsController {
  constructor(private readonly settingsService: SystemSettingsService) {}

  @Get()
  async getSettings(): Promise<SystemSettings> {
    return this.settingsService.getSettings();
  }

  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Permissions('settings.manage')
  @ApiBearerAuth()
  async updateSettings(
    @Body() dto: Partial<SystemSettings>,
  ): Promise<SystemSettings> {
    return this.settingsService.updateSettings(dto);
  }
}
