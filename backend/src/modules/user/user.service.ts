import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { IUser } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<IUser> {
    return this.userRepo.createUser(dto);
  }

  async getAllUsers(): Promise<IUser[]> {
    return this.userRepo.getAllUsers();
  }

  async getUserById(userId: number): Promise<IUser> {
    const user = await this.userRepo.getUserById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return user;
  }

  async updateUser(userId: number, dto: UpdateUserDto): Promise<IUser> {
    const updatedUser = await this.userRepo.updateUser(userId, dto);
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    return updatedUser;
  }

  async deleteUser(userId: number): Promise<void> {
    const success = await this.userRepo.deleteUser(userId);
    if (!success) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.userRepo.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }
}
