import {  IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
    latitude: number;

    @IsNumber()
    longitude: number;
    
}