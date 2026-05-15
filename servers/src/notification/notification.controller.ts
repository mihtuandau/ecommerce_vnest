import {
  Controller,
  Get,
  Put,
  Patch,
  Body,
  Query,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/auth.guard';
import { NotificationService } from './notification.service';
import { UpdateNotificationSettingsDto } from './dto/update-settings.dto';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  async getMyNotifications(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Req() req: any,
  ) {
    return this.notificationService.getMyNotifications(req.user.userId, +page, +limit);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Req() req: any) {
    return this.notificationService.markAsRead(req.user.userId, +id);
  }

  @Patch('mark-all-read')
  async markAllAsRead(@Req() req: any) {
    return this.notificationService.markAllAsRead(req.user.userId);
  }

  @Get('settings')
  async getSettings(@Req() req: any) {
    return this.notificationService.getSettings(req.user.userId);
  }

  @Put('settings')
  async updateSettings(
    @Body() dto: UpdateNotificationSettingsDto,
    @Req() req: any,
  ) {
    return this.notificationService.updateSettings(req.user.userId, dto);
  }
}
