import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeRepository } from './repositories/recipe.repository';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';
import { IRecipe } from './interfaces/recipe.interface';

@Injectable()
export class RecipeService {
  constructor(private readonly recipeRepo: RecipeRepository) {}

  async createRecipe(dto: CreateRecipeDto): Promise<IRecipe> {
    return this.recipeRepo.createRecipe(dto);
  }

  async getAllRecipes(): Promise<IRecipe[]> {
    return this.recipeRepo.getAllRecipes();
  }

  async getRecipeById(recipeId: number): Promise<IRecipe> {
    const recipe = await this.recipeRepo.getRecipeById(recipeId);
    if (!recipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }
    return recipe;
  }

  async updateRecipe(recipeId: number, dto: UpdateRecipeDto): Promise<IRecipe> {
    const updatedRecipe = await this.recipeRepo.updateRecipe(recipeId, dto);
    if (!updatedRecipe) {
      throw new NotFoundException(`Recipe with ID ${recipeId} not found`);
    }
    return updatedRecipe;
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    await this.recipeRepo.deleteRecipe(recipeId);
  }
}
