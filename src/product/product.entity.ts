import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/user.entity';
import { Category } from 'src/category/category.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { Favorites } from 'src/favorites/favorites.entity';
import { Messages } from 'src/message/message.entity';
import { ChatRoom } from 'src/chat-room/chat-room.entity';

@Table({
  tableName: 'products3',
  timestamps: true,
})
export class Product extends Model<Product> {
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.FLOAT, allowNull: false })
  price: number;

  @Column({
    type: DataType.ENUM('available', 'sold'),
    allowNull: false,
    defaultValue: 'available',
  })
  status: 'available' | 'sold';

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER, allowNull: true })
  userId: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  latitude: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
  })
  longitude: number;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => ProductImage, { foreignKey: 'productId', as: 'images', onDelete: 'CASCADE' })
  images: ProductImage[];

  @HasMany(() => Favorites, { onDelete: 'CASCADE' })
  favorites: Favorites[];

  @HasMany(() => Messages, { onDelete: 'CASCADE' })
  messages: Messages[];

  @HasMany(() => ChatRoom, { onDelete: 'CASCADE' })
  chatRooms: ChatRoom[];
}