import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDto } from 'src/validators/message.validate';
import { Messages } from './message.entity';

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
    


}
