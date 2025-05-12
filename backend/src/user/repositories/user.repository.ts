import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const skip = (page - 1) * limit;
      const [data, total] = await this.userRepo.findAndCount({
        skip,
        take: limit,
        relations: ['recipes', 'reviews', 'favorites', 'searches'],
      });
      this.logger.log(`Fetched ${data.length} users (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.userRepo.findOne({
        where: { user_id: id },
        relations: ['recipes', 'reviews', 'favorites', 'searches'],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySigninAccount(signin_account: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { signin_account } });
    } catch (error) {
      this.logger.error(`Failed to fetch user with signin_account ${signin_account}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Failed to fetch user with email ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.userRepo.delete(id);
      if (result.affected === 0) {
        throw new Error(`User with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}