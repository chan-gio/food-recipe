import { FilterRecipeDto } from 'src/recipe/dtos/filter-recipe.dto';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { PaginationDto } from '../dots/pagination.dto';
import { TopContributor } from '../types/response.type';

export interface IRecipeRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  findById(id: number): Promise<Recipe | null>;
  filterRecipes(filterDto: FilterRecipeDto, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  getTopContributors(limit: number): Promise<TopContributor[]>; 
  getMostFavoritedRecipes(limit: number): Promise<Recipe[]>;
  searchRecipesByName(name: string, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  create(recipe: Partial<Recipe>): Promise<Recipe>;
  update(id: number, recipe: Partial<Recipe>): Promise<Recipe>;
  delete(id: number): Promise<void>;
}