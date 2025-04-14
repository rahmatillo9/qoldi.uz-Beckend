
import { ProductDto } from 'src/validators/product.valdator';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { Favorites } from 'src/favorites/favorites.entity';
import { Messages } from 'src/message/message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { promisify } from 'util';
import { unlink } from 'fs';
import { Category } from 'src/category/category.entity';

const unlinkAsync = promisify(unlink);
@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product) private readonly productModel: typeof Product,
    @InjectModel(Favorites) private readonly favoriteModel: typeof Favorites,
    @InjectModel(Messages) private readonly messageModel: typeof Messages,
    @InjectModel(ChatRoom) private readonly chatRoomModel: typeof ChatRoom,
    @InjectModel(ProductImage) private readonly productImageModel: typeof ProductImage,
  ) { }

  async createProduct(productDto: ProductDto): Promise<Product> {
    const product = await this.productModel.create({ ...productDto } as Product);
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productModel.findAll({
      include: [
        { model: ProductImage, as: 'images' }
      ],
    });
    return products;
  }

  async getProductByUserId(userId: number): Promise<Product[]> {
    const products = await this.productModel.findAll({ where: { userId } });
    if (!products) {
      throw new Error(`Products with user id ${userId} not found`);
    }
    return products;
  }

  async getProductById(id: number): Promise<Product> {
    const product = await this.productModel.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        { model: ProductImage, as: 'images' },
        { model: Favorites, as: 'favorites' },
        { model: Messages, as: 'messages' },
        { model: ChatRoom, as: 'chatRooms' },
      ],
    });
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  async updateProduct(id: number, productDto: ProductDto): Promise<Product> {
    const product = await this.getProductById(id);
    await product.update(productDto);
    return product;
  }



  async getProductByTitle(title: string): Promise<Product> {
    const product = await this.productModel.findOne({ where: { title } });
    if (!product) {
      throw new Error(`Product with title ${title} not found`);
    }
    return product;
  }

  async getProductByCategoryId(categoryId: number): Promise<Product[]> {
    const products = await this.productModel.findAll({ where: { categoryId } });
    if (!products) {
      throw new Error(`Products with category id ${categoryId} not found`);
    }
    return products;
  }



  async deleteProduct(productId: number) {
    if (!this.productModel.sequelize) {
      throw new Error('Sequelize instance is not available');
    }

    try {
      return await this.productModel.sequelize.transaction(async (transaction) => {
        const product = await this.productModel.findByPk(productId, {
          include: [
            { model: ProductImage, as: 'images' },
            Favorites,
            Messages,
            ChatRoom,
          ],
          transaction,
        });

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        console.log(`product.images: ${JSON.stringify(product.images)}`);

        // Images
        await this.deleteProductImages(product, transaction);

        // Favorites
        const deletedFavorites = await this.favoriteModel.destroy({
          where: { productId: product.id },
          transaction,
        });
        console.log(`Deleted Favorites: ${deletedFavorites}`);

        // Messages
        const deletedMessages = await this.messageModel.destroy({
          where: { productId: product.id },
          transaction,
        });
        console.log(`Deleted Messages: ${deletedMessages}`);

        // ChatRooms
        const deletedChatRooms = await this.chatRoomModel.destroy({
          where: { productId: product.id },
          transaction,
        });
        console.log(`Deleted ChatRooms: ${deletedChatRooms}`);

        // Product
        await product.destroy({ transaction });

        return { message: 'Product and all related data deleted successfully' };
      });
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }

  private async deleteProductImages(product: Product, transaction?: any) {
    const images = await this.productImageModel.findAll({
      where: { productId: product.id },
      transaction,
    });
    console.log(`Images: ${JSON.stringify(images)}`);

    if (images && images.length > 0) {
for (const image of images) {
  console.log('image.imageUrl:', image.imageUrl); 
  console.log('getDataValue bilan:', image.getDataValue('imageUrl'));

        try {
          
          const imagePath = `.${image.getDataValue('imageUrl')}`; // ./uploads/productImage/123.jpg
          await unlinkAsync(imagePath);
          console.log(`${image.getDataValue('imageUrl')} muvaffaqiyatli o‘chirildi`);
        } catch (err) {
          console.error(`Rasmni o‘chirishda xatolik: ${err.message} `);
        }
      }
      await this.productImageModel.destroy({
        where: { productId: product.id },
        transaction,
      });
      console.log(`Ma'lumotlar bazasidan rasmlar o‘chirildi (productId: ${product.id})`);
    } else {
      console.log(`Hech qanday rasm topilmadi (productId: ${product.id})`);
    }
  }


}





