import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';


import * as dotenv from "dotenv";
import { MailModule } from './email/mail-modul';
import { UsersModule } from './users/users.module';
import { AuthModule } from './authguard/JwtModule ';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';
import { CategoryModule } from './category/category.module';
import { MessageModule } from './message/message.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ChatRoomModule } from './chat-room/chat-room.module';

dotenv.config();
@Module({
  imports: [

    MailModule,
    UsersModule,
    AuthModule,

   SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadModels: true,
      synchronize: true,

      // pool: {
      //   max: 10, // Eng ko‘p 10 ta ulanish
      //   min: 2,  // Eng kamida 2 ta ulanish
      //   acquire: 30000, // 30s ichida ulana olmasa, timeout
      //   idle: 10000, // 10s harakatsiz bo‘lsa, ulanish yopiladi
      // },
    }),

   ProductModule,
   ProductImageModule,
   CategoryModule,
   MessageModule,
   FavoritesModule,
   ChatRoomModule,




  ],

})
export class AppModule {}


  