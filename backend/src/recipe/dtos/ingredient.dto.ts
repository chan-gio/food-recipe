import { IsInt, IsNotEmpty } from 'class-validator';

export class IngredientDto {
  @IsInt()
  @IsNotEmpty()
  ingredient_id: number;
}