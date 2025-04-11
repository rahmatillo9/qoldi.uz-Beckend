import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { Favorites } from 'src/favorites/favorites.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { Messages } from 'src/message/message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Product, Favorites, ProductImage, Messages, ChatRoom]),
  ],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [ProductService],
})
export class ProductModule {}
