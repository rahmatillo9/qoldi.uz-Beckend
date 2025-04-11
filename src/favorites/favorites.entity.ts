import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';

@Table({
    tableName: 'favorites3',
    timestamps: true,
})
export class Favorites extends Model<Favorites> {
    @ForeignKey(() => Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    productId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    userId!: number;

    @BelongsTo(() => Product)
    product!: Product;

    @BelongsTo(() => User)
    user!: User;
}
