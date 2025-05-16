import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { ChatRoom } from "src/chat-room/chat-room.entity";
import { Favorites } from "src/favorites/favorites.entity";
import { Messages } from "src/message/message.entity";
import { Product } from "src/product/product.entity";

@Table({
  tableName: "users6",
  timestamps: true,
})
export class User extends Model<User> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: true,
  })
  email!: string;

  @Column({
    type: DataType.ENUM('customer', 'admin'),
    allowNull: false,
    defaultValue: 'customer',
  })
  role!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  avatar?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  bio!: string;

  // 📌 Email tasdiqlash uchun
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  verificationCode?: string;

  // 📌 Parolni qayta tiklash uchun kod
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
  })
  resetCode?: string | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // ❌ Standart holatda email tasdiqlanmagan
  })
  isEmailConfirmed!: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailConfirmationToken?: string;

  @HasMany(() => Product)
  products!: Product[];

  @HasMany(() => Favorites)
  favorites!: Favorites[];

  @HasMany(() => Messages, 'senderId')
  sentMessages!: Messages[];

  @HasMany(() => Messages, 'receiverId')
  receivedMessages!: Messages[];

  @HasMany(() => ChatRoom, 'user1Id')
  chatRooms1!: ChatRoom[];

  @HasMany(() => ChatRoom, 'user2Id')
  chatRooms2!: ChatRoom[];
}
