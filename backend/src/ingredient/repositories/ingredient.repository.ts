import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { IIngredientRepository } from '../../common/interfaces/ingredient.repository.interface';

@Injectable()
export class IngredientRepository implements IIngredientRepository {
  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientRepo.find(
      {
        relations: ['recipes'],
      },
    );
  }

  async findById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepo.findOne({ where: { ingredient_id: id }, relations: ['recipes'] });
  }

  async create(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const newIngredient = this.ingredientRepo.create(ingredient);
    return this.ingredientRepo.save(newIngredient);
  }

  async update(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    await this.ingredientRepo.update(id, ingredient);
    const updatedIngredient = await this.findById(id);
    if (!updatedIngredient) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
    return updatedIngredient;
  }

  async delete(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }
}