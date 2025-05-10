import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessageService } from './message.service';
import { MessageDto } from 'src/validators/message.validate';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';
// @UseGuards(JwtAuthGuard, RolesGuard)
@WebSocketGateway(5006, { cors: { origin: '*' } }) // CORS konfiguratsiyasi ishlab chiqishda universal qilib qo'yilgan
export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userRooms = new Map<number, string>();

  constructor(private readonly messageService: MessageService) {}

  // Foydalanuvchi serverga ulanayotganda uni qo'shish
  handleConnection(client: Socket) {
    console.log(`🔌 Client connected: ${client.id}`);
  }

  // Foydalanuvchi serverdan uzilganida chiqish
  handleDisconnect(client: Socket) {
    console.log(`❌ Client disconnected: ${client.id}`);
    // Agar foydalanuvchi uzilsa, room ma'lumotini o'chirish
    this.userRooms.forEach((value, key) => {
      if (value === client.id) {
        this.userRooms.delete(key);
      }
    });
  }

  // Foydalanuvchini chatga qo'shish
  @SubscribeMessage('joinChat')
  async joinChat(@MessageBody() userId: number, @ConnectedSocket() client: Socket) {
    if (typeof userId !== 'number') {
      client.emit('error', { message: 'Invalid userId' });
      return;
    }
    this.userRooms.set(userId, client.id); // Foydalanuvchini roomga qo'shish
    client.join(`user-${userId}`);
    client.emit('joined', { userId }); // Tasdiq
    console.log(`User ${userId} joined room`);
  }

  // Xabar yuborish
  @SubscribeMessage('send_message')
  async handleSendMessage(@MessageBody() messageDto: MessageDto, @ConnectedSocket() client: Socket) {
    try {
      const message = await this.messageService.createMessage(messageDto);
      
      // Xabarni faqat kerakli foydalanuvchilarga yuborish
      this.server.to(`user-${messageDto.receiverId}`).emit('new_message', message);
      this.server.to(`user-${messageDto.senderId}`).emit('new_message', message);
      return message;
    } catch (error) {
      client.emit('error', { message: 'Failed to send message' });
      console.error('Error sending message:', error);
    }
  }

  // Barcha xabarlarni olish
  @SubscribeMessage('get_all_messages')
  async handleGetAllMessages(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    if (typeof chatId !== 'number') {
      client.emit('error', { message: 'Invalid chatId' });
      return;
    }
    try {
      const messages = await this.messageService.getMessagesChatRoomId(chatId);
      client.emit('loadMessages', messages || []);
    } catch (error) {
      client.emit('error', { message: 'Failed to fetch messages' });
      console.error('Error fetching messages:', error);
    }
  }


  @SubscribeMessage('mark_as_seen')
  async handleMarkAsSeen(
    @MessageBody() data: { messageId: number; userId: number },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { messageId, userId } = data;
  
    try {
      const message = await this.messageService.markAsSeen(messageId, userId);
  
      this.server.to(`user-${message.senderId}`).emit('message_seen', {
        messageId: message.id,
      });
    } catch (error) {
      console.error('Error marking message as seen:', error);
      client.emit('error', { message: error.message || 'Failed to mark message as seen' });
    }
  }
  
  
  // Xabarni o'chirish
  @SubscribeMessage('delete_message')
  async deleteMessage(@MessageBody() messageId: number, @ConnectedSocket() client: Socket) {
    try {
      const message = await this.messageService.getMessageById(messageId);
      if (!message) {
        client.emit('error', { message: 'Message not found' });
        return;
      }
      await this.messageService.deleteMessage(messageId);
      this.server.to(`user-${message.receiverId}`).emit('message_deleted', { messageId });
      this.server.to(`user-${message.senderId}`).emit('message_deleted', { messageId });
    } catch (error) {
      client.emit('error', { message: 'Failed to delete message' });
      console.error('Error deleting message:', error);
    }
  }
}
