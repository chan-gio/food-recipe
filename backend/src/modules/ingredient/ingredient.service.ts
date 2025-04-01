import { Injectable, NotFoundException } from '@nestjs/common';
import { IngredientRepository } from './repositories/ingredient.repository';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';
import { IIngredient } from './interfaces/ingredient.interface';

@Injectable()
export class IngredientService {
  constructor(private readonly ingredientRepo: IngredientRepository) {}

  async createIngredient(dto: CreateIngredientDto): Promise<IIngredient> {
    return this.ingredientRepo.createIngredient(dto);
  }

  async getAllIngredients(): Promise<IIngredient[]> {
    return this.ingredientRepo.getAllIngredients();
  }

  async getIngredientById(ingredientId: number): Promise<IIngredient> {
    const ingredient = await this.ingredientRepo.getIngredientById(ingredientId);
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found`);
    }
    return ingredient;
  }

  async updateIngredient(ingredientId: number, dto: UpdateIngredientDto): Promise<IIngredient> {
    const updatedIngredient = await this.ingredientRepo.updateIngredient(ingredientId, dto);
    if (!updatedIngredient) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found`);
    }
    return updatedIngredient;
  }

  async deleteIngredient(ingredientId: number): Promise<void> {
    const result = await this.ingredientRepo.deleteIngredient(ingredientId);
    if (!result) {
      throw new NotFoundException(`Ingredient with ID ${ingredientId} not found`);
    }
  }
}
