import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from 'src/validators/product.valdator';
import { Product } from './product.entity';
import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';
import { Roles } from 'src/validators/RolesGuard/Roles';
import { Role } from 'src/validators/users.validator';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

      @UseGuards(JwtAuthGuard, RolesGuard)
     @Roles(Role.Admin)
    @Post()
    async createPost(@Body() productDto: ProductDto) {
        return await this.productService.createProduct(productDto);
    }

    @Get('paginated')
    async getPaginated(
      @Query('limit') limit: string,
      @Query('offset') offset: string,
    ) {
      const limitNumber = parseInt(limit) || 20;
      const offsetNumber = parseInt(offset) || 0;
      return this.productService.getPaginatedProducts(limitNumber, offsetNumber);
    }
    
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Patch('status/:id')
    async toggleStatus(@Param('id', ParseIntPipe) id: number): Promise<Product> {
      return this.productService.toggleProductStatus(id);
    }

    @Get('search')
    async searchProducts(
      @Query('title') title: string,
      @Query('minPrice') minPrice?: string,
      @Query('maxPrice') maxPrice?: string,
      @Query('categoryId') categoryId?: string // yangi qo‘shilgan query param
    ) {
      const min = minPrice ? parseFloat(minPrice) : undefined;
      const max = maxPrice ? parseFloat(maxPrice) : undefined;
      const category = categoryId ? parseInt(categoryId, 10) : undefined;
    
      if (!title) {
        return {
          message: 'Title query param is required',
        };
      }
    
      return await this.productService.searchProducts(title, min, max, category);
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

    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id')
    async updateProduct(@Param('id') id: number, @Body() productDto: ProductDto) {
        return await this.productService.updateProduct(id, productDto);
    }


    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
      try {
        const result = await this.productService.deleteProduct(parseInt(id, 10));
        return result;
      } catch (error) {
        return {
          message: 'Error deleting product ',
          error: error.message,
        };
      }
    }
    
}