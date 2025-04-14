import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from './message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { MessageGateway } from './message.getway';

@Module({
  imports: [
    SequelizeModule.forFeature([Messages, ChatRoom, Product, ProductImage]),
  ],
  providers: [MessageService, MessageGateway],
  controllers: [MessageController],
   exports: [MessageService],
})
export class MessageModule {}
