import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { UsersController } from './user.controller';
import { MailService } from 'src/email/mail.service';
import { Product } from 'src/product/product.entity';
import { Messages } from 'src/message/message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { JwtService } from '@nestjs/jwt';




@Module({
  imports: [
    SequelizeModule.forFeature([User, Product, Messages, ChatRoom ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, MailService, JwtService],
  exports: [UsersService],
})
export class UsersModule {}

