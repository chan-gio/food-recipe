import { User } from '../../user/entities/user.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IUserRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }>;
  findById(id: number): Promise<User | null>;
  findBySigninAccount(signin_account: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: Partial<User>): Promise<User>;
  searchByFullNameAndEmail(
    full_name: string,
    email: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: User[]; total: number }>;
  // update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}