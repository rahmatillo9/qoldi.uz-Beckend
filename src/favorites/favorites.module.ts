import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Favorites } from './favorites.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Favorites, ProductImage, Product])
  ],
  providers: [FavoritesService],
  controllers: [FavoritesController],
  exports: [FavoritesService],
})
export class FavoritesModule {}
