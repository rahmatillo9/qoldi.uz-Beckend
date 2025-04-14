import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Messages } from './message.entity';
import { MessageDto } from 'src/validators/message.validate';
import { Product } from 'src/product/product.entity';
import { ProductImage } from 'src/product-image/product-image.entity';

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
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'imageUrl', 'productId'],
                        },
                    ],
                },
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
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                        },
                    ],
                },
            ],
        });
    }
    

    async getMessageById(id: number): Promise<Messages> {
        const message = await this.messageModel.findByPk(id, {
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'imageUrl', 'productId'],
                        },
                    ],
                },
            ],
        });
        if (!message) {
            throw new Error(`Message with id ${id} not found`);
        }
        return message;
    }



    async getMessageByProductId(productId: number): Promise<Messages[]> {
        const messages = await this.messageModel.findAll({
            where: { productId },
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price'],
                    include: [
                        {
                            model: ProductImage,
                            as: 'images',
                            attributes: ['id', 'imageUrl', 'productId'],
                        },
                    ],
                },
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
