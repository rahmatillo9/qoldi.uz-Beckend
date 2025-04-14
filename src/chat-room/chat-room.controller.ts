import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomDto } from 'src/validators/chat-room.validator';
import { ChatRoom } from './chat-room.entity';

@Controller('chat-room')
export class ChatRoomController {
    constructor(
        private readonly chatRoomService: ChatRoomService,
    ){}

    @Post()
    async createChatRoom(@Body() chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
        return this.chatRoomService.createChatRoom(chatRoomDto);
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



    @Delete(':id')
    async deleteChatRoom(@Param('id') id: number): Promise<void> {
        return this.chatRoomService.deleteChatRoom(id);
    }
    

}
