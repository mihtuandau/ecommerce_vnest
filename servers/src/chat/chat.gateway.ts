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
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'https://dautuan.com',
      'https://www.dautuan.com',
    ],
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
    this.logger.log(`New socket connection attempt: ${client.id}`);
    try {
      const authHeader = client.handshake.headers?.authorization;
      const authBody = client.handshake.auth?.token;
      const cookieHeader = client.handshake.headers?.cookie;

      let token = authBody || (authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null);

      if (!token && cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, curr) => {
          const [key, value] = curr.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as any);
        token = cookies['accessToken'] || cookies['access_token'];
      }

      if (!token) {
        this.logger.warn(`Socket connection ${client.id} disconnected: No token provided`);
        client.disconnect();
        return;
      }

      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!payload) {
        this.logger.error('Chat connection failed: Invalid payload');
        client.disconnect();
        return;
      }

      this.logger.log(`User connected to chat: ${payload.email}`);
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

    this.logger.log(`User ${user.email} joining room: ${data.roomId}`);
    
    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', ''); 

    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      this.logger.warn(`Unauthorized room join attempt: User ${user.sub} to room ${data.roomId}`);
      return { error: 'Unauthorized' };
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

    this.logger.log(`Message from ${user.email} to room ${data.roomId}`);
    
    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(user.role?.toUpperCase());
    const roomUserId = data.roomId.replace('room_', '');

    if (!isStaff && String(roomUserId) !== String(user.sub)) {
      this.logger.warn(`Unauthorized message attempt: User ${user.sub} to room ${data.roomId}`);
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

    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(
      user.role?.toUpperCase(),
    );
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

    const isStaff = ['ADMIN', 'WAREHOUSE', 'SALES'].includes(
      user.role?.toUpperCase(),
    );
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
