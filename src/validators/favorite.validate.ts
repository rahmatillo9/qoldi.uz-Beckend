import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class  FaoriteDto{
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    userId: number;

      @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    productId: number;
}