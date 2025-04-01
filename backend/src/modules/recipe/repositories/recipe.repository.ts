import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RecipeRepository {
  constructor(
    @InjectRepository(Recipe)
    private readonly repo: Repository<Recipe>,
  ) {}

  async createRecipe(data: Partial<Recipe>) {
    return this.repo.save(data);
  }

  async getAllRecipes() {
    return this.repo.find({ relations: ['categories', 'ingredients'] });
  }

  async getRecipeById(id: number) {
    const recipe = await this.repo.findOne({ where: { recipe_id: id }, relations: ['categories', 'ingredients'] });
    if (!recipe) throw new NotFoundException(`Recipe with ID ${id} not found`);
    return recipe;
  }

  async updateRecipe(id: number, data: Partial<Recipe>) {
    const recipe = await this.getRecipeById(id);
    Object.assign(recipe, data);
    return this.repo.save(recipe);
  }

  async deleteRecipe(id: number) {
    const recipe = await this.getRecipeById(id);
    await this.repo.remove(recipe);
  }
}
