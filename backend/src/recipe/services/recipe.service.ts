import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { IRecipeRepository } from '../../common/interfaces/recipe.repository.interface';
import { IRecipeService } from '../../common/interfaces/recipe.service.interface';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../dtos/update-recipe.dto';
import { UploadMediaDto } from '../dtos/upload-media.dto';

@Injectable()
export class RecipeService implements IRecipeService {
  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
  ) {}

  async getAllRecipes(): Promise<Recipe[]> {
    return this.recipeRepository.findAll();
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async createRecipe(dto: CreateRecipeDto & { user_id: number }): Promise<Recipe> {
    const recipe = { ...dto, user: { user_id: dto.user_id } as any };
    return this.recipeRepository.create(recipe);
  }

  async updateRecipe(id: number, dto: UpdateRecipeDto): Promise<Recipe> {
    await this.getRecipeById(id); // Ensure the recipe exists
    return this.recipeRepository.update(id, dto);
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.getRecipeById(id); // Ensure the recipe exists
    await this.recipeRepository.delete(id);
  }

  async uploadMedia(file: Express.Multer.File, dto: UploadMediaDto): Promise<string> {
    // Implement Cloudinary upload logic
    return 'https://res.cloudinary.com/your_cloud_name/image/upload/recipes/example.jpg';
  }
}