import { Recipe } from '../../recipe/entities/recipe.entity';
import { CreateRecipeDto } from '../../recipe/dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../../recipe/dtos/update-recipe.dto';
import { UploadMediaDto } from '../../recipe/dtos/upload-media.dto';

export interface IRecipeService {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: number): Promise<Recipe>;
  createRecipe(dto: CreateRecipeDto, userId: number): Promise<Recipe>;
  updateRecipe(id: number, dto: UpdateRecipeDto): Promise<Recipe>;
  deleteRecipe(id: number): Promise<void>;
  uploadMedia(file: Express.Multer.File, dto: UploadMediaDto): Promise<string>;
}