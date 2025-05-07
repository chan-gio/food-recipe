import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    email?: string;
  
    @IsOptional()
    @IsString()
    password?: string;
  }
  