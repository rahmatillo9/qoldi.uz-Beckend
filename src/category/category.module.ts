import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './category.entity';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Category, Product, ProductImage, ]),
  ],
  providers: [CategoryService],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
