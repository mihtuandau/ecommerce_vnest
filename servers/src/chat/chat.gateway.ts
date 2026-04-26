import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://dautuan.com', 'https://www.dautuan.com'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      client.data.user = payload; 
    } catch (err) {
      this.logger.error(`Chat connection failed: ${err.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const user = client.data.user;
    if (!user) return { error: 'Unauthorized' };

    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', ''); 

    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      this.logger.warn(`User ${user.sub} tried to join unauthorized room: ${data.roomId}`);
      return { error: 'Unauthorized room access' };
    }

    client.join(data.roomId);
    const messages = await this.chatService.getMessages(data.roomId);

    return messages;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; message: string },
  ) {
    const user = client.data.user;
    if (!user) return { error: 'Unauthorized' };

    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', '');

    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      return { error: 'Unauthorized' };
    }

    const savedMessage = await this.chatService.createMessage(
      data.roomId,
      user.sub, 
      data.message,
    );

    this.server.to(data.roomId).emit('newMessage', savedMessage);
    
    return savedMessage;
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const user = client.data.user;
    if (!user) return;

    // Security Check: Only staff or room owner can mark as read
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', '');
    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      return;
    }

    await this.chatService.markAsRead(data.roomId, user.sub);
    this.server.to(data.roomId).emit('messagesRead', { roomId: data.roomId });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; isTyping: boolean },
  ) {
    const user = client.data.user;
    if (!user) return;

    // Security Check: Only staff or room owner can send typing events
    const isStaff = ['ADMIN', 'KHO', 'BAN_HANG'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', '');
    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      return;
    }

    client.to(data.roomId).emit('userTyping', {
      userName: user.name || 'Ai đó', 
      isTyping: data.isTyping,
    });
  }
}
