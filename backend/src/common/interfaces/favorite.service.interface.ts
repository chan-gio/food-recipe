import { Favorite } from '../../favorite/entities/favorite.entity';
import { CreateFavoriteDto } from '../../favorite/dtos/create-favorite.dto';

export interface IFavoriteService {
  getAllFavorites(): Promise<Favorite[]>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite>;
  createFavorite(dto: CreateFavoriteDto): Promise<Favorite>;
  deleteFavorite(userId: number, recipeId: number): Promise<void>;
}