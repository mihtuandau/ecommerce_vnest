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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  handleConnection(client: Socket) {}

  handleDisconnect(client: Socket) {}

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: number },
  ) {
    client.join(data.roomId);// Load message history
    const messages = await this.chatService.getMessages(data.roomId);
    return messages;
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; senderId: number; message: string },
  ) {
    const savedMessage = await this.chatService.createMessage(
      data.roomId,
      data.senderId,
      data.message,
    );

    // Broadcast to room
    this.server.to(data.roomId).emit('newMessage', savedMessage);
    
    return savedMessage;
  }

  @SubscribeMessage('markAsRead')
  async handleMarkAsRead(
    @MessageBody() data: { roomId: string; userId: number },
  ) {
    await this.chatService.markAsRead(data.roomId, data.userId);
    this.server.to(data.roomId).emit('messagesRead', { roomId: data.roomId });
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userName: string; isTyping: boolean },
  ) {
    client.to(data.roomId).emit('userTyping', {
      userName: data.userName,
      isTyping: data.isTyping,
    });
  }
}
