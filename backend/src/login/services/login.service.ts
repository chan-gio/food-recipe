import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../user/entities/user.entity';
import { LoginDto } from '../dtos/login.dto';
import { UnauthorizedAccessException } from '../../common/exceptions/unauthorized.exception';
import * as bcrypt from 'bcrypt';
import { ILoginService } from 'src/common/interfaces/login.service.interface';

@Injectable()
export class LoginService implements ILoginService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<{ access_token: string; user_id: number }> {
    const user = await this.userRepo.findOne({ where: { signin_account: dto.signin_account } });
    if (!user) {
      throw new UnauthorizedAccessException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedAccessException('Invalid credentials');
    }

    const payload = { sub: user.user_id, username: user.signin_account, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user_id: user.user_id };
  }
}