import { Controller, Get, UseGuards } from '@nestjs/common';
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
}








