import {
  Controller,
  Get,
  UseGuards,
  Param,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Permissions } from '../common/decorators/permissions.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('rooms')
  @Permissions('chat.support')
  async getAllRooms() {
    return this.chatService.getAllRooms();
  }

  @Get('rooms/:roomId/messages')
  async getMessages(@Param('roomId') roomId: string, @Req() req: any) {
    const user = req.user;
    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(
      user.role?.toUpperCase(),
    );
    const roomUserId = roomId.replace('room_', '');

    if (!isStaff && String(roomUserId) !== String(user.id)) {
      throw new ForbiddenException('Bạn không có quyền truy cập hội thoại này');
    }

    return this.chatService.getMessages(roomId);
  }

  @Get('rooms/:roomId/mark-as-read')
  async markAsRead(@Param('roomId') roomId: string, @Req() req: any) {
    const user = req.user;
    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(
      user.role?.toUpperCase(),
    );
    const roomUserId = roomId.replace('room_', '');

    if (!isStaff && String(roomUserId) !== String(user.id)) {
      throw new ForbiddenException('Bạn không có quyền truy cập hội thoại này');
    }

    return this.chatService.markAsRead(roomId, user.id);
  }
}
