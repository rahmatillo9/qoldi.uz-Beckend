import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProductImageDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  productId: string;
}