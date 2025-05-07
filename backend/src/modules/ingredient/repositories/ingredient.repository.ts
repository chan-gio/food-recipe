import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class IngredientRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly repo: Repository<Ingredient>,
  ) {}

  async createIngredient(data: Partial<Ingredient>) {
    return this.repo.save(data);
  }

  async getAllIngredients() {   
    return this.repo.find();
  }

  async getIngredientById(ingredientId: number) {
    return this.repo.findOne({ where: { ingredient_id: ingredientId } });
  }

  async updateIngredient(ingredientId: number, data: Partial<Ingredient>) {
    await this.repo.update(ingredientId, data);
    return this.getIngredientById(ingredientId);
  }

  async deleteIngredient(ingredientId: number): Promise<boolean> {
    const result = await this.repo.delete(ingredientId);
    return (result.affected ?? 0) > 0; 
  }
}
