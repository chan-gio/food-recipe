import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { IUserService } from 'src/common/interfaces/user.service.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async register(dto: CreateUserDto): Promise<User> {
    const existingByAccount = await this.userRepository.findBySigninAccount(dto.signin_account);
    if (existingByAccount) {
      throw new BadRequestException('Signin account already exists');
    }
    if (dto.email) {
      const existingByEmail = await this.userRepository.findByEmail(dto.email);
      if (existingByEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = {
      signin_account: dto.signin_account,
      password: hashedPassword,
      email: dto.email || null,
      full_name: dto.full_name || null,
      role: dto.role || 'user',
    };

    return this.userRepository.create(user);
  }

  async create(user: Partial<User>): Promise<User> {
    return this.userRepository.create(user);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    return this.userRepository.update(id, user);
  }

  async delete(id: number): Promise<void> {
    return this.userRepository.delete(id);
  }
}