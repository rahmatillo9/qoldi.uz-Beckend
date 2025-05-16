import { IsOptional, IsString } from 'class-validator';

export class loginDto {
  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsString()
  password: string;
}
