import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MessageService } from './message.service';
  import { MessageDto } from 'src/validators/message.validate';
  
  @WebSocketGateway(5006, { cors: true })
  export class MessageGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;
  
    constructor(private readonly messageService: MessageService) {}
  
    handleConnection(client: Socket) {
      console.log(`🔌 Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`❌ Client disconnected: ${client.id}`);
    }
  
    // 1. Client xabar yuborganda
    @SubscribeMessage('send_message')
    async handleSendMessage(@MessageBody() messageDto: MessageDto) {
      const message = await this.messageService.createMessage(messageDto);
  
      // 2. Boshqalarga broadcast
      this.server.emit('new_message', message);
      return message;
    }

    
  
    // 3. Client istasa barcha xabarlarni olish
    @SubscribeMessage('get_all_messages')
    async handleGetAllMessages() {
      const messages = await this.messageService.getAllMessages();
      return messages;
    }
  }
  