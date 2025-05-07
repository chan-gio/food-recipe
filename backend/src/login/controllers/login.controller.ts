import { Controller, Post, Body, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { ILoginService } from '../../common/interfaces/login.service.interface';
import { Response } from '../../common/types/response.type';
import { LoginDto } from '../dtos/login.dto';

@Controller('login')
export class LoginController {
  constructor(
    @Inject('ILoginService')
    private readonly loginService: ILoginService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto): Promise<Response<{ access_token: string }>> {
    const data = await this.loginService.login(dto);
    return { data, message: 'Login successful', code: 200 };
  }
}