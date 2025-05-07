import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find(
      {
        relations: ['favorites', 'recipes'],
      },
    );
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { user_id: id }, relations: ['favorites', 'recipes'] });
  }

  async findBySigninAccount(signin_account: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { signin_account } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepo.update(id, user);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error(`User with id ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}