import { Recipe } from '../../recipe/entities/recipe.entity';
import { CreateRecipeDto } from '../../recipe/dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../../recipe/dtos/update-recipe.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface IRecipeService {
  findAll(paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }>;
  getRecipeById(id: number): Promise<Recipe>;
  createRecipe(dto: CreateRecipeDto, userId: number, files?: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] }): Promise<Recipe>;
  updateRecipe(id: number, dto: UpdateRecipeDto, files?: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] }): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
}