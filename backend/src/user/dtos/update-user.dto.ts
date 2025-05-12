import { IsString, IsOptional, IsEnum, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  signin_account?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString({ each: true })
  @IsOptional()
  profile_picture: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';
}