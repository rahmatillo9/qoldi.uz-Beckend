import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Messages } from './message.entity';
import { MessageDto } from 'src/validators/message.validate';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';
import { User } from 'src/users/user.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Messages) private readonly messageModel: typeof Messages,
    ) { }

    async createMessage(messageDto: MessageDto): Promise<Messages> {
        const message = await this.messageModel.create({ ...messageDto } as Messages);
        return message;
    }

    async getAllMessages(): Promise<Messages[]> {
        const messages = await this.messageModel.findAll({
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
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                  },

                  {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                  }
            ],
        });
        return messages;
    }

    async getMessagesChatRoomId(chatRoomId: number): Promise<Messages[]> {
        const messages = await this.messageModel.findAll({
            where: { chatRoomId },
            include: [


                  {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                  },

                  {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                  }
            ],
        });
        return messages;
    }

    

    async getUserMessages(senderId: number): Promise<Messages[]> {
        return this.messageModel.findAll({
            where: { senderId },
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
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                  },

                  {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                  }
            ],
        });
    }

    async getMessageById(id: number): Promise<Messages> {
        const message = await this.messageModel.findByPk(id, {
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
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                  },

                  {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                  }
            ],
        });
        if (!message) {
            throw new Error(`Message with id ${id} not found`);
        }
        return message;
    }

   
    // // Yangi qo'shilgan metod: Xabarni ko'rilgan deb belgilash
    async markAsSeen(id: number, userId: number): Promise<Messages> {
      const message = await this.getMessageById(id);
    
      if (!message) {
        throw new Error('Message not found');
      }
    
      if (message.dataValues.receiverId !== userId) {
        throw new Error('Not allowed to mark this message as seen');
      }

      const newIsRead = message.dataValues.isRead === false ? true : true
    
      console.log('newIsRead',  message.dataValues.isRead);
      
      await message.update({ isRead: newIsRead });
      console.log('newIsRead',  message.dataValues.isRead);
      await message.reload();
    
      return message;
    }
    

    async countUnreadMessagesForUser(userId: number): Promise<number> {
      const count = await this.messageModel.count({
        where: {
          receiverId: userId,
          isRead: false,
        },
      });
      return count;
    }
    
    async countUnreadMessagesInChatRoom(chatRoomId: number, receiverId: number): Promise<number> {
      const count = await this.messageModel.count({
        where: {
          chatRoomId,
          receiverId,
          isRead: false,
        },
      });
      return count;
    }
    

    async getMessageByProductId(productId: number): Promise<Messages[]> {
        const messages = await this.messageModel.findAll({
            where: { productId },
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
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                  },

                  {
                    model: User,
                    as: 'receiver',
                    attributes: ['id', 'username', 'avatar'],
                  }
            ],
        });
        if (!messages) {
            throw new Error(`Messages with product id ${productId} not found`);
        }
        return messages;
    }

    async updateMessage(id: number, messageDto: MessageDto): Promise<Messages> {
        const message = await this.getMessageById(id);
        await message.update(messageDto);
        return message;
    }

    async deleteMessage(id: number): Promise<void> {
        const message = await this.getMessageById(id);
        await message.destroy();
    }
}
