import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from 'src/validators/product.valdator';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post()
    async createPost(@Body() productDto: ProductDto) {
        return await this.productService.createProduct(productDto);
    }

    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: number) {
        return await this.productService.getProductById(id);
    }

    @Get('title/:title')
    async getProductByTitle(@Param('title') title: string) {
        return await this.productService.getProductByTitle(title);
    }

    @Get('category/:categoryId')
    async getProductByCategoryId(@Param('categoryId') categoryId: number) {
        return await this.productService.getProductByCategoryId(categoryId);
    }

    @Get('user/:userId')
    async getProductByUserId(@Param('userId') userId: number) {
        return await this.productService.getProductByUserId(userId);

    }

    @Put(':id')
    async updateProduct(@Param('id') id: number, @Body() productDto: ProductDto) {
        return await this.productService.updateProduct(id, productDto);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number) {
        return await this.productService.deleteProduct(id);
    }
}