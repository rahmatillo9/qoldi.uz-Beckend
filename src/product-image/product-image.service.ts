import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductImage } from './product-image.entity';
import { CreateProductImageDto } from 'src/validators/product-image.validator';
import { existsSync, unlink } from 'fs';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectModel(ProductImage)
    private productImageModel: typeof ProductImage
  ) {}

  async create(dto: CreateProductImageDto): Promise<ProductImage> {
    return this.productImageModel.create({...dto} as any);
  }

  async findAll(): Promise<ProductImage[]> {
    return this.productImageModel.findAll();
  }

  async findOne(id: number): Promise<ProductImage | null> {
    return this.productImageModel.findByPk(id);
  }

  async findByProductId(productId: number): Promise<ProductImage[]> {
    return this.productImageModel.findAll({ where: { productId } });
  }

  async update(id: number, dto: Partial<CreateProductImageDto>): Promise<ProductImage> {
    const productImage = await this.findOne(id);
    if (!productImage) throw new NotFoundException('Product image not found');
    await productImage.update({...dto} as any);
    return productImage;
  }

  async delete(id: number): Promise<void> {
    const productImage = await this.findOne(id);
    if (!productImage) throw new NotFoundException('Image not found');

    if (productImage.dataValues.imageUrl) {
      const imagePath = `.${productImage.dataValues.imageUrl}`;
      if (existsSync(imagePath)) {
        unlink(imagePath, (err) => {
          if (err) console.error('Rasmni o‘chirishda xatolik:', err);
          else console.log('Rasm muvaffaqiyatli o‘chirildi');
        });
      }
    }

    await productImage.destroy();
  }
}
