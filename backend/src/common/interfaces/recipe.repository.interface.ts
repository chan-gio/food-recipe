import { Recipe } from '../../recipe/entities/recipe.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IRecipeRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  findById(id: number): Promise<Recipe | null>;
  create(recipe: Partial<Recipe>): Promise<Recipe>;
  update(id: number, recipe: Partial<Recipe>): Promise<Recipe>;
  delete(id: number): Promise<void>;
}