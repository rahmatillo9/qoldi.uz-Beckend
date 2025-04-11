import { IsNotEmpty, IsString } from "class-validator";

export class CreateProductImageDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  productId: string;
}