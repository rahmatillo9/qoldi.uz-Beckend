import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Product } from './product.entity';
import { ProductDto } from 'src/validators/product.valdator';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product) private readonly productModel: typeof Product,
    ){}

    async createProduct(productDto: ProductDto): Promise<Product> {
        const product = await this.productModel.create({ ...productDto } as Product);
        return product;
    }

    async getAllProducts(): Promise<Product[]> {
        const products = await this.productModel.findAll();
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
        const product = await this.productModel.findByPk(id);
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

    async deleteProduct(id: number): Promise<void> {
        const product = await this.getProductById(id);
        await product.destroy();
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


}
