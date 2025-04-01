import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUser } from '../interfaces/user.interface'; 

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = await this.repo.save(data);
    return { user_id: user.user_id, email: user.email, password: user.password };
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this.repo.find();
    return users.map(user => ({
      user_id: user.user_id,
      email: user.email,
      password: user.password,
    }));
  }

  async getUserById(userId: number): Promise<IUser | null> {
    const user = await this.repo.findOne({ where: { user_id: userId } });
    if (!user) return null;
    return { user_id: user.user_id, email: user.email, password: user.password };
  }

  async updateUser(userId: number, data: Partial<IUser>): Promise<IUser | null> {
    await this.repo.update(userId, data);
    return this.getUserById(userId);
  }

  async deleteUser(userId: number): Promise<boolean> {
    const result = await this.repo.delete(userId);
    return (result.affected ?? 0) > 0;
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    const user = await this.repo.findOne({ where: { email } });
    if (!user) return null;
    return { user_id: user.user_id, email: user.email, password: user.password };
  }
}
