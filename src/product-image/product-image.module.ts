import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from './product-image.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductImage]),

  ],
  providers: [ProductImageService],
  controllers: [ProductImageController],
  exports: [ProductImageService],
})
export class ProductImageModule {}
