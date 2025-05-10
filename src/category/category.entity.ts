import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/product.entity';
@Table({
    tableName: 'categories',
    timestamps: true,
})
export class Category extends Model<Category> {
    @Column({
        type: DataType.JSON,
        allowNull: false,
    })
    name!: {
        uz: string;
        ru: string;
        en: string;
      };

    @HasMany(() => Product)
    products!: Product[];
}