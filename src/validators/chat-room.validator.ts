import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class ChatRoomDto {
   
      @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    productId: number;


    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    user1Id: number;


    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    user2Id: number;

    
}