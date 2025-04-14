import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    WebSocketServer,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
  import { MessageService } from 'src/message/message.service';
  import { ChatRoomService } from 'src/chat-room/chat-room.service';
  import { MessageDto } from 'src/validators/message.validate';
  
  @WebSocketGateway(5007, { cors: true })
  export class ChatGateway
    implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
  {
    @WebSocketServer()
    server: Server;
  
    constructor(
      private readonly messageService: MessageService,
      private readonly chatRoomService: ChatRoomService,
    ) {}
  
    afterInit(server: Server) {
      console.log('WebSocket Gateway Initialized ✅');
    }
  
    handleConnection(client: Socket) {
      console.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      console.log(`Client disconnected: ${client.id}`);
    }
  
    // Foydalanuvchini room'ga qo‘shish
    @SubscribeMessage('joinRoom')
    handleJoinRoom(
      @ConnectedSocket() client: Socket,
      @MessageBody() roomId: string,
    ) {
      client.join(roomId);
      console.log(`Client ${client.id} joined room ${roomId}`);
      this.server.to(roomId).emit('userJoined', `User ${client.id} joined`);
    }

    @SubscribeMessage('sendMessage')
async handleMessage(
  @MessageBody() messageDto: MessageDto,
  @ConnectedSocket() client: Socket,
) {
  const { senderId, productId } = messageDto;

  // Avtomatik chat-room bor-yo‘qligini tekshirish (user1 va user2 o‘rni)
  const chatRooms = await this.chatRoomService.getAllChatRooms();
  let chatRoom = chatRooms.find(
    room =>
      (room.user1Id === messageDto.senderId || room.user2Id === messageDto.senderId) &&
      room.productId === productId,
  );

  // Agar topilmasa, yangisini yaratamiz (demo uchun user2Id hardcoded  — o‘zingizga moslashtirasiz)
  if (!chatRoom) {
    chatRoom = await this.chatRoomService.createChatRoom({
      user1Id: messageDto.senderId,
      user2Id: 2, // bu yerda frontenddan olishingiz kerak
      productId: productId,
    });
  }

  // ChatRoom ID'ni messageDto ga beramiz
  messageDto.chatRoomId = chatRoom.id;

  // Endi xabarni yozamiz
  const savedMessage = await this.messageService.createMessage(messageDto);

  // Xabarni client'ga yuboramiz
  const roomId = chatRoom.id.toString();
  this.server.to(roomId).emit('newMessage', savedMessage);
}

  

  }
  