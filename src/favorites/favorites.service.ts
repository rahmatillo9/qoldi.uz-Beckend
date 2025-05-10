import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Favorites } from "./favorites.entity";
import { FaoriteDto } from "src/validators/favorite.validate";
import { Product } from "src/product/product.entity";
import { ProductImage } from "src/product-image/product-image.entity";
import { User } from "src/users/user.entity";

@Injectable()
export class FavoritesService {
    constructor(
        @InjectModel(Favorites)
        private readonly favoriteModel: typeof Favorites
    ) { }

    async create(dto: FaoriteDto): Promise<Favorites> {
        return this.favoriteModel.create({ ...dto } as any);
    }

    async findByUserId(userId: number): Promise<Favorites[]> {
        const favorites = await this.favoriteModel.findAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: ProductImage,
                        },

                        
                    ],
                },

                {
                    model: User,
                    attributes: ["id", "username", "avatar"],
                    as: "user",
                }
            ],
        });
        if (!favorites || favorites.length === 0) {
            throw new NotFoundException(`No favorites found for user with ID ${userId}`);
        }
        return favorites;
    }

    async findAll(): Promise<Favorites[]> {
        return this.favoriteModel.findAll({
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: ProductImage,
                        },
                    ],
                },
            ],
        });
    }

    async findOne(id: number): Promise<Favorites> {
        const favorite = await this.favoriteModel.findByPk(id, {
            include: [
                {
                    model: Product,
                    include: [
                        {
                            model: ProductImage,
                        },
                    ],
                },
            ],
        });
        if (!favorite) throw new NotFoundException("Favorite not found");
        return favorite;
    }

    async toggleFavorite(dto: FaoriteDto): Promise<{ status: string }> {
        const existing = await this.favoriteModel.findOne({
          where: {
            userId: dto.userId,
            productId: dto.productId,
          },
        });
      
        if (existing) {
          await existing.destroy();
          return { status: 'removed' };
        } else {
          await this.favoriteModel.create(dto as any);
          return { status: 'added' };
        }
      }
      

      async checkFavorite(userId: number, productId: number): Promise<{ isFavorite: boolean }> {
        const favorite = await this.favoriteModel.findOne({
          where: {
            userId,
            productId,
          },
        });
      
        return { isFavorite: !!favorite }; // agar topilsa true, topilmasa false
      }
      

    async delete(id: number): Promise<void> {
        const favorite = await this.findOne(id);
        await favorite.destroy();
    }
}