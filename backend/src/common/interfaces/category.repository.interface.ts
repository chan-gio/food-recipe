import { Category } from '../../category/entities/category.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface ICategoryRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: Category[]; total: number }>;
  findById(id: number): Promise<Category | null>;
  findByName(name: string): Promise<Category[]>;
  create(category: Partial<Category>): Promise<Category>;
  update(id: number, category: Partial<Category>): Promise<Category>;
  delete(id: number): Promise<void>;
}