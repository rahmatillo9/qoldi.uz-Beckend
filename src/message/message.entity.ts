import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ChatRoom } from 'src/chat-room/chat-room.entity';
import { Product } from 'src/product/product.entity';
import { User } from 'src/users/user.entity';

@Table({
    tableName: 'messages4',
    timestamps: true,
})
export class Messages extends Model<Messages> {
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
    senderId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    receiverId!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    content!: string;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      })
      isRead!: boolean;
      

    // Bog‘lanishlar
    @BelongsTo(() => User, 'senderId')
    sender!: User;

    @BelongsTo(() => User, 'receiverId')
    receiver!: User;

    @BelongsTo(() => Product)
    product!: Product;

    @ForeignKey(() => ChatRoom)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    chatRoomId!: number;

    @BelongsTo(() => ChatRoom,
     { onDelete: 'CASCADE',
        hooks: true,})
    chatRoom!: ChatRoom;
}
