import { CategoryDto } from 'src/validators/category.validator';
import { CategoryService } from './category.service';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/authguard/jwt-auth.guard';
import { RolesGuard } from 'src/validators/RolesGuard/Roluse.guard';
import { Roles } from 'src/validators/RolesGuard/Roles';
import { Role } from 'src/validators/users.validator';



@Controller('category')
export class CategoryController {
    constructor(private readonly CategoryService: CategoryService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
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


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete(':id')
    async deleteCategory(@Param('id') id: number) {
        return await this.CategoryService.deleteCategory(id);
    }

}
