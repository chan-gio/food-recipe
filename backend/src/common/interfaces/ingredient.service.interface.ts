import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { CreateIngredientDto } from '../../ingredient/dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../../ingredient/dtos/update-ingredient.dto';

export interface IIngredientService {
  getAllIngredients(): Promise<Ingredient[]>;
  getIngredientById(id: number): Promise<Ingredient>;
  createIngredient(dto: CreateIngredientDto): Promise<Ingredient>;
  updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient>;
  deleteIngredient(id: number): Promise<void>;
}