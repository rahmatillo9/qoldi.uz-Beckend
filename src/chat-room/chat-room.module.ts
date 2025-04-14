import { Module } from '@nestjs/common';
import { ChatRoomService } from './chat-room.service';
import { ChatRoomController } from './chat-room.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ChatRoom } from './chat-room.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';
import { Messages } from 'src/message/message.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { ChatGateway } from './chat-room.gatway';
import { MessageService } from 'src/message/message.service';

@Module({
  imports: [
    SequelizeModule.forFeature([ChatRoom, Product, User, Messages, ProductImage]),
  ],
  providers: [ChatRoomService, ChatGateway, MessageService],
  controllers: [ChatRoomController],
  exports: [ChatRoomService],
})
export class ChatRoomModule {}
