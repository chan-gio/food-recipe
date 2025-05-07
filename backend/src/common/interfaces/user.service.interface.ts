import { User } from '../../user/entities/user.entity';
import { CreateUserDto } from '../../user/dtos/create-user.dto';

export interface IUserService {
  findAll(): Promise<User[]>;
  findById(id: number): Promise<User | null>;
  register(dto: CreateUserDto): Promise<User>;
  create(user: Partial<User>): Promise<User>;
  update(id: number, user: Partial<User>): Promise<User>;
  delete(id: number): Promise<void>;
}