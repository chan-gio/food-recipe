import { Favorite } from '../../favorite/entities/favorite.entity';
import { CreateFavoriteDto } from '../../favorite/dtos/create-favorite.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface IFavoriteService {
  getAllFavorites(paginationDto: PaginationDto): Promise<{ data: Favorite[]; total: number }>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite>;
  createFavorite(dto: CreateFavoriteDto): Promise<Favorite>;
  deleteFavorite(userId: number, recipeId: number): Promise<void>;
}