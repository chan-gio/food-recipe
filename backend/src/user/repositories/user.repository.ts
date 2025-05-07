import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = ((page ?? 1) - 1) * (limit ?? 10);
    const [data, total] = await this.userRepo.findAndCount({
      skip,
      take: limit,
      relations: ['recipes', 'reviews', 'favorites', 'searches'],
    });
    return { data, total };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepo.findOne({ where: { user_id: id }, relations: ['recipes', 'reviews', 'favorites', 'searches'] });
  }

  async findBySigninAccount(signin_account: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { signin_account }, relations: ['recipes', 'reviews', 'favorites', 'searches'] });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email }, relations: ['recipes', 'reviews', 'favorites', 'searches'] });
  }

  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepo.update(id, user);
    const updatedUser = await this.findById(id);
    if (!updatedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  async delete(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new Error(`User with ID ${id} not found`);
    }
  }
}