import { IsInt } from 'class-validator';

export class CreateFavoriteDto {
  @IsInt()
  user_id: number;

  @IsInt()
  recipe_id: number;
}