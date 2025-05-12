import { Favorite } from '../../favorite/entities/favorite.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IFavoriteRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: Favorite[]; total: number }>;
  findByUserId(userId: number): Promise<Favorite[]>;
  findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite | null>;
  create(favorite: Partial<Favorite>): Promise<Favorite>;
  delete(userId: number, recipeId: number): Promise<void>;
}