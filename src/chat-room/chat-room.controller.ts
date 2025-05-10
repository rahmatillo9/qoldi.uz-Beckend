import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomDto } from 'src/validators/chat-room.validator';
import { ChatRoom } from './chat-room.entity';
import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';


@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('chat-room')
export class ChatRoomController {
    constructor(
        private readonly chatRoomService: ChatRoomService,
    ){}

    @Post()
    async createChatRoom(@Body() chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
        return this.chatRoomService.createChatRoom(chatRoomDto);
    }

    @Get(':chatRoomId/unread-count')
    async getUnreadMessageCount(
      @Param('chatRoomId') chatRoomId: number,
      @Query('receiverId') receiverId: number,
    ): Promise<{ unreadCount: number }> {
      const count = await this.chatRoomService.getUnreadMessageCountForChatRoom(chatRoomId, receiverId);
      return { unreadCount: count };
    }
  

    @Get()
    async getAllChatRooms(): Promise<ChatRoom[]> {
        return this.chatRoomService.getAllChatRooms();
    }

    @Get(':id')
    async getChatRoomById(@Param('id') id: number): Promise<ChatRoom> {
        return this.chatRoomService.getChatRoomById(id);
    }
   
    @Put(':id')
    async updateChatRoom(@Param('id') id: number, @Body() chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
        return this.chatRoomService.updateChatRoom(id, chatRoomDto);
    }
    @Get('user/:userId')
    async getAllChatRoomsByUserId(
      @Param('userId', ParseIntPipe) userId: number,
    ): Promise<ChatRoom[]> {
      return this.chatRoomService.getAllChatRoomsByUserId(userId);
    }
    

    @Get('product/:productId/user/:userId')
    async getChatRoomByProductIdAndUserId(@Param('productId') productId: number, @Param('userId') userId: number): Promise<ChatRoom> {
        return this.chatRoomService.getChatRoomByProductAndUser(productId, userId);
    }


    @Delete(':id')
    async deleteChatRoom(@Param('id') id: number): Promise<void> {
        return this.chatRoomService.deleteChatRoom(id);
    }
    

}
