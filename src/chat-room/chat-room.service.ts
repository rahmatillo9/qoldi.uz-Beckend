import { Injectable } from '@nestjs/common';
import { ChatRoom } from './chat-room.entity';
import { InjectModel } from '@nestjs/sequelize';
import { ChatRoomDto } from 'src/validators/chat-room.validator';
import { Messages } from 'src/message/message.entity';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';

@Injectable()
export class ChatRoomService {
    constructor(
        @InjectModel(ChatRoom) private readonly chatRoomModel: typeof ChatRoom,
    ) { }

    async createChatRoom(chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
        const chatRoom = await this.chatRoomModel.create({ ...chatRoomDto } as ChatRoom);
        return chatRoom;
    }

    async getAllChatRooms(): Promise<ChatRoom[]> {
        const chatRooms = await this.chatRoomModel.findAll({
            include: [Messages,
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'imageUrl', 'productId'],
                        }
                    ]



                },


            ],
        });
        return chatRooms;
    }

    async getChatRoomById(id: number): Promise<ChatRoom> {
        const chatRoom = await this.chatRoomModel.findByPk(id, {
            include: [Messages,
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'imageUrl', 'productId'],
                        }
                    ]



                },


            ],
        });
        if (!chatRoom) {
            throw new Error(`Chat room with id ${id} not found`);
        }
        return chatRoom;
    }

    async updateChatRoom(id: number, chatRoomDto: ChatRoomDto): Promise<ChatRoom> {
        const chatRoom = await this.getChatRoomById(id);
        await chatRoom.update(chatRoomDto);
        return chatRoom;
    }

    async deleteChatRoom(id: number): Promise<void> {
        const chatRoom = await this.getChatRoomById(id);
        await chatRoom.destroy();
    }

}
