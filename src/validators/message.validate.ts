import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MessageDto {
   
      @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    senderId: number;
    
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    receiverId: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    content: string;

    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    chatRoomId: number;


}