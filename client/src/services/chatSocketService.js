import { io } from 'socket.io-client';
import { API_CONFIG } from '../config/api.config';

const SOCKET_URL = API_CONFIG.SOCKET_URL;

class ChatSocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
      });

      this.socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  joinRoom(roomId, userId) {
    if (!this.socket) this.connect();
    
    return new Promise((resolve) => {
      this.socket.emit('joinRoom', { roomId, userId }, (messages) => {
        resolve(messages);
      });
    });
  }

  sendMessage(roomId, senderId, message) {
    if (!this.socket) this.connect();
    
    return new Promise((resolve) => {
      this.socket.emit('sendMessage', { roomId, senderId, message }, (savedMessage) => {
        resolve(savedMessage);
      });
    });
  }

  onNewMessage(callback) {
    if (!this.socket) this.connect();
    this.socket.on('newMessage', callback);
    this.listeners.set('newMessage', callback);
  }

  onUserTyping(callback) {
    if (!this.socket) this.connect();
    this.socket.on('userTyping', callback);
    this.listeners.set('userTyping', callback);
  }

  sendTyping(roomId, userName, isTyping) {
    if (!this.socket) this.connect();
    this.socket.emit('typing', { roomId, userName, isTyping });
  }

  markAsRead(roomId, userId) {
    if (!this.socket) this.connect();
    this.socket.emit('markAsRead', { roomId, userId });
  }

  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }
}

export default new ChatSocketService();
