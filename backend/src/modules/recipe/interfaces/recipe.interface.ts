import { Category } from '../../category/entities/category.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';

export interface IRecipe {
  recipe_id: number;
  recipe_name: string;
  description?: string;
  recipe_type: string;
  quantity: number;
  categories: Category[];
  ingredients: Ingredient[];
}
