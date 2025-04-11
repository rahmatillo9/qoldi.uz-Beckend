import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatRoom } from './chat-room.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';
import { Messages } from 'src/message/message.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ChatRoom, Product, User, Messages]),
  ],
  providers: [ChatRoomService],
  controllers: [ChatRoomController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
