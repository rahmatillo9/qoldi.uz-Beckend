import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/product.entity';

@Table({
  tableName: 'product_image',
  timestamps: true,
  underscored: true,
})
export class ProductImage extends Model<ProductImage> {
  @Column({ type: DataType.STRING, allowNull: false })
  imageUrl: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  productId: number;

  @BelongsTo(() => Product, { foreignKey: 'productId' })
  product: Product;
}