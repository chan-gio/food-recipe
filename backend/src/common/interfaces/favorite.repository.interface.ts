import { Favorite } from '../../favorite/entities/favorite.entity';

export interface IFavoriteRepository {
  findAll(): Promise<Favorite[]>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite | null>;
  create(favorite: Partial<Favorite>): Promise<Favorite>;
  delete(userId: number, recipeId: number): Promise<void>;
}