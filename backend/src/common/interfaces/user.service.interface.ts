import { User } from '../../user/entities/user.entity';
import { CreateUserDto } from '../../user/dtos/create-user.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface IUserService {
  findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }>;
  findById(id: number): Promise<User | null>;
  register(dto: CreateUserDto): Promise<User>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  searchByFullNameAndEmail(
    full_name: string,
    email: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: User[]; total: number }>;
  delete(id: number): Promise<void>;
}