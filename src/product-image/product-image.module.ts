import { Module } from '@nestjs/common';
import { ProductImageService } from './product-image.service';
import { ProductImageController } from './product-image.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductImage } from './product-image.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([ProductImage, Product]),

  ],
  providers: [ProductImageService],
  controllers: [ProductImageController],
  exports: [ProductImageService],
})
export class ProductImageModule {}
