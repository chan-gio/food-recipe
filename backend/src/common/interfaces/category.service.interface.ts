import { Category } from '../../category/entities/category.entity';
import { CreateCategoryDto } from '../../category/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../category/dtos/update-category.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface ICategoryService {
  findAll(paginationDto: PaginationDto): Promise<{ data: Category[]; total: number }>;
  getCategoryById(id: number): Promise<Category>;
  findByName(name: string): Promise<Category[]>;
  createCategory(dto: CreateCategoryDto): Promise<Category>;
  updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
}