import { CategoryDto } from './../validators/category.validator';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.entity';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';

@Injectable()
export class CategoryService {
    constructor(
        @InjectModel(Category) private readonly categoryModel: typeof Category,
    ) {}

    async createCategory(categoryDto: CategoryDto): Promise<Category> {
        const category = await this.categoryModel.create({ ...categoryDto } as Category);
        return category;
    }

    async getAllCategories(): Promise<Category[]> {
        const categories = await this.categoryModel.findAll({
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
        return categories;
    }

    async getCategoryById(id: number): Promise<Category> {
        const category = await this.categoryModel.findByPk(id, {
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
        if (!category) {
            throw new Error(`Category with id ${id} not found`);
        }
        return category;
    }

    async updateCategory(id: number, categoryDto: CategoryDto): Promise<Category> {
        const category = await this.getCategoryById(id);
        await category.update(categoryDto);
        return category;
    }

    async deleteCategory(id: number): Promise<void> {
        const category = await this.getCategoryById(id);
        await category.destroy();
    }
    
    async getCategoryByName(name: string): Promise<Category> {
        const category = await this.categoryModel.findOne({ where: { name },
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
        if (!category) {
            throw new Error(`Category with name ${name} not found`);
        }
        return category;
    }
}
