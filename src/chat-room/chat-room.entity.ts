import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { Messages } from 'src/message/message.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';

@Table({
    tableName: 'chat_rooms',
    timestamps: true,
    underscored: true,
})
export class ChatRoom extends Model<ChatRoom> {
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
    user1Id!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    user2Id!: number;

    // BOG‘LANISHLAR
    @BelongsTo(() => Product)
    product!: Product;

    @BelongsTo(() => User, 'user1Id')
    user1!: User;

    @BelongsTo(() => User, 'user2Id')
    user2!: User;

    @HasMany(() => Messages)
    messages!: Messages[];
}
