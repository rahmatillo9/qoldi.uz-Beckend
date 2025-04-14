import { IsNotEmpty, IsNumber } from "class-validator";

export class  FaoriteDto{
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
    @IsNotEmpty()
    productId: number;
}