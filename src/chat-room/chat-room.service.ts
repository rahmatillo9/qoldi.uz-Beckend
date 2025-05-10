import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ChatRoom } from './chat-room.entity';
import { Op } from 'sequelize';
import { ChatRoomDto } from 'src/validators/chat-room.validator';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { Messages } from 'src/message/message.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectModel(ChatRoom)
    private readonly chatRoomModel: typeof ChatRoom,
  ) {}

  async createChatRoom(chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
    const { user1Id, user2Id, productId } = chatRoomDto;
  
    // endi productId ham tekshiruvga qo'shiladi
    const existingChatRoom = await this.chatRoomModel.findOne({
      where: {
        productId,
        [Op.or]: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id },
        ],
      },
    });
  
    if (existingChatRoom) {
      return existingChatRoom;
    }
  
    return this.chatRoomModel.create(chatRoomDto as ChatRoom);
  }
  
  
  

  async getAllChatRooms(): Promise<ChatRoom[]> {
    return this.chatRoomModel.findAll({
        include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'title', 'description', 'status', 'price'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['id', 'imageUrl', 'productId'],
                },
              ],
            },
            {
              model: User,
              as: 'user1',
              attributes: ['id', 'username', 'avatar'],
            },
            {
              model: User,
              as: 'user2',
              attributes: ['id', 'username', 'avatar'],
            },
            {
              model: Messages,
            },
          ],
    });
  }

  async getChatRoomById(id: number): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomModel.findByPk(id, {
        include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'title', 'description', 'status', 'price'],
              include: [
                {
                  model: ProductImage,
                  as: 'images',
                  attributes: ['id', 'imageUrl', 'productId'],
                },
              ],
            },
            {
              model: User,
              as: 'user1',
              attributes: ['id', 'username', 'avatar'],
            },
            {
              model: User,
              as: 'user2',
              attributes: ['id', 'username', 'avatar'],
            },
            {
              model: Messages,
            },
          ],
    });

    if (!chatRoom) {
      throw new NotFoundException(`Chat room with id ${id} not found`);
    }

    return chatRoom;
  }

  async updateChatRoom(id: number, chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
    const chatRoom = await this.getChatRoomById(id);
    await chatRoom.update(chatRoomDto);
    return chatRoom;
  }


  

  async deleteChatRoom(chatRoomId: number): Promise<void> {
    if (!this.chatRoomModel.sequelize) {
      throw new Error('Sequelize instance is not available');
    }
  
    try {
      await this.chatRoomModel.sequelize.transaction(async (transaction) => {
        const chatRoom = await this.chatRoomModel.findByPk(chatRoomId, { transaction });
  
        if (!chatRoom) {
          throw new NotFoundException(`ChatRoom with ID ${chatRoomId} not found`);
        }
  
        // Messages
        const deletedMessages = await Messages.destroy({
          where: { chatRoomId },
          transaction,
        });
        console.log(`Deleted Messages: ${deletedMessages}`);
  
        // ChatRoom
        await chatRoom.destroy({ transaction });
  
        console.log(`ChatRoom with ID ${chatRoomId} deleted successfully`);
      });
    } catch (error) {
      console.error('Delete chat room error:', error);
      throw error;
    }
  }
  


  async getUnreadMessageCountForChatRoom(chatRoomId: number, receiverId: number): Promise<number> {
    const count = await Messages.count({
      where: {
        chatRoomId,
        receiverId,
        isRead: false,
      },
    });
  
    return count;
  }
  

  async getChatRoomByProductAndUser(productId: number, user1Id: number): Promise<ChatRoom> {
  const chatRoom = await this.chatRoomModel.findOne({
    where: {
      productId,
      user1Id,
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'title', 'description', 'status', 'price'],
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['id', 'imageUrl', 'productId'],
          },
        ],
      },
      {
        model: User,
        as: 'user1',
        attributes: ['id', 'username', 'avatar'],
      },
      {
        model: User,
        as: 'user2',
        attributes: ['id', 'username', 'avatar'],
      },
      {
        model: Messages,
      },
    ],
  });

  if (!chatRoom) {
    throw new NotFoundException(`Chat room not found for productId ${productId} and user1Id ${user1Id}`);
  }

  return chatRoom;
}


async getAllChatRoomsByUserId(userId: number): Promise<ChatRoom[]> {
  return this.chatRoomModel.findAll({
    where: {
      [Op.or]: [
        { user1Id: userId },
        { user2Id: userId },
      ],
    },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'title', 'description', 'status', 'price'],
        include: [
          {
            model: ProductImage,
            as: 'images',
            attributes: ['id', 'imageUrl', 'productId'],
          },
        ],
      },
      {
        model: User,
        as: 'user1',
        attributes: ['id', 'username', 'avatar'],
      },
      {
        model: User,
        as: 'user2',
        attributes: ['id', 'username', 'avatar'],
      },
   
    ],
  });
}

}
