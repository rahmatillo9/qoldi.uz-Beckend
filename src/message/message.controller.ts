import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from 'src/validators/message.validate';
import { Messages } from './message.entity';
import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}



    

    @Post()
    async createMessage(@Body() messageDto: MessageDto): Promise<Messages> {
        return this.messageService.createMessage(messageDto);
    }



    @Get()
    async getAllMessages(): Promise<Messages[]> {
        return this.messageService.getAllMessages();
    }

    @Get(':senderId')
    async getUserMessages(@Body('senderId') senderId: number): Promise<Messages[]> {
        return this.messageService.getUserMessages(senderId);
    }

    @Get(':id')
    async getMessageById(@Body('id') id: number): Promise<Messages> {
        return this.messageService.getMessageById(id);
    }
    

    @Get('countUnreadMessagesForUser/:userId')
    async countUnreadMessagesForUser(@Param('userId') userId: number): Promise<number> {
        return this.messageService.countUnreadMessagesForUser(userId);
    }

    @Get('countUnreadMessagesForChatRoom/:chatRoomId')
    async countUnreadMessagesForChatRoom(
      @Param('chatRoomId') chatRoomId: number,
      @Query('receiverId') receiverId: number
    ): Promise<number> {
      return this.messageService.countUnreadMessagesInChatRoom(chatRoomId, receiverId);
    }
    


    @Get('product/:productId')
    async getMessagesByProductId(@Body('productId') productId: number): Promise<Messages[]> {
        return this.messageService.getMessageByProductId(productId);
    }


    @Put(':id')
    async updateMessage(@Body('id') id: number, @Body() messageDto: MessageDto): Promise<Messages> {
        return this.messageService.updateMessage(id, messageDto);
    }

    @Delete(':id')
    async deleteMessage(@Body('id') id: number): Promise<void> {
        return this.messageService.deleteMessage(id);
    }

    @Get('chat-room/:chatRoomId')
    async getMessagesChatRoomId(@Param('chatRoomId') chatRoomId: number): Promise<Messages[]> {
        return this.messageService.getMessagesChatRoomId(Number(chatRoomId));
    }

    
    


}
