import { Controller, Get, UseGuards, Param } from '@nestjs/common';
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
  @Permissions('chat.support')
  async getMessages(@Param('roomId') roomId: string) {
    return this.chatService.getMessages(roomId);
  }

  @Get('rooms/:roomId/mark-as-read')
  @Permissions('chat.support')
  async markAsRead(@Param('roomId') roomId: string) {
    return this.chatService.markAsRead(roomId, 0); 
  }
}








