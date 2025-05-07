import { IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;  

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;  

  @IsNotEmpty()
  password: string;
}
