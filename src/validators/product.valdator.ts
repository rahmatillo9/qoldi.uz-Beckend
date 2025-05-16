import {  IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export enum Status {
    available = 'available',
    sold = 'sold'
}

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsOptional()
    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;

    @IsNumber()
    @IsNotEmpty()
    categoryId: number;

    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @IsNumber()
      @IsOptional()
    latitude: number;

      @IsOptional()
    @IsNumber()
    longitude: number;
    
}