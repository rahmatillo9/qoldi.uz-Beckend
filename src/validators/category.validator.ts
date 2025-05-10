import {  IsNotEmpty, IsObject } from "class-validator";

export class CategoryDto {
  @IsObject()
  @IsNotEmpty()
  name: {
    uz: string;
    ru: string;
    en: string;
  };
}