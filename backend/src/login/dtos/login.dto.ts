import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  signin_account: string;

  @IsString()
  password: string;
}