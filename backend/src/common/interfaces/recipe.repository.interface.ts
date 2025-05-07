import { Recipe } from '../../recipe/entities/recipe.entity';

export interface IRecipeRepository {
  findAll(): Promise<Recipe[]>;
  findById(id: number): Promise<Recipe | null>;
  create(recipe: Partial<Recipe>): Promise<Recipe>;
  update(id: number, recipe: Partial<Recipe>): Promise<Recipe>;
  delete(id: number): Promise<void>;
}