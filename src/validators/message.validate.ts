import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MessageDto {
   
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    senderId: number;
    
    @IsNumber()
    @IsNotEmpty()
    receiverId: number;

    @IsString()
    @IsNotEmpty()
    content: string;

    @IsNumber()
    @IsNotEmpty()
    chatRoomId: number;


}