import { IsNotEmpty, IsNumber } from "class-validator";

export class ChatRoomDto {
   
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    user1Id: number;

    @IsNumber()
    @IsNotEmpty()
    user2Id: number;

    
}