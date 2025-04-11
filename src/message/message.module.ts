import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from './message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Messages, ChatRoom]),
  ],
  providers: [MessageService],
  controllers: [MessageController],
   exports: [MessageService],
})
export class MessageModule {}
