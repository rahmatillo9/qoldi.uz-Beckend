import { CategoryDto } from 'src/validators/category.validator';
import { CategoryService } from './category.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('category')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) { }

    @Post()
    async createCategory(@Body() dto: CategoryDto) {
        return await this.CategoryService.createCategory(dto);
    }

  @Get()
    async getAllCategories() {
        return await this.CategoryService.getAllCategories();
    }

    @Get(':id')
    async getCategoryById(@Param('id') id: number) {
        return await this.CategoryService.getCategoryById(id);
    }

    @Put(':id')
    async updateCategory(@Param('id') id: number, @Body() dto: CategoryDto) {
        return await this.CategoryService.updateCategory(id, dto);
    }

    @Get('name/:name')
    async getCategoryByName(@Param('name') name: string) {
        return await this.CategoryService.getCategoryByName(name);
    }

    @Delete(':id')
    async deleteCategory(@Param('id') id: number) {
        return await this.CategoryService.deleteCategory(id);
    }

}
