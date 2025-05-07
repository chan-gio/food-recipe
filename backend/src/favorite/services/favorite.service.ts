import { Inject, Injectable } from '@nestjs/common';
import { IFavoriteRepository } from '../../common/interfaces/favorite.repository.interface';
import { Favorite } from '../entities/favorite.entity';
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { IFavoriteService } from 'src/common/interfaces/favorite.service.interface';

@Injectable()
export class FavoriteService implements IFavoriteService {
  constructor(
    @Inject('IFavoriteRepository')
    private readonly favoriteRepository: IFavoriteRepository,
  ) {}

  async getAllFavorites(): Promise<Favorite[]> {
    return this.favoriteRepository.findAll();
  }

  async findByUserId(userId: number): Promise<Favorite[]> {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    if (!favorites || favorites.length === 0) {
      throw new EntityNotFoundException('Favorites', userId);
    }
    return favorites;
  }

  async findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite> {
    const favorite = await this.favoriteRepository.findByUserAndRecipe(userId, recipeId);
    if (!favorite) {
      throw new EntityNotFoundException('Favorite', recipeId);
    }
    return favorite;
  }

  async createFavorite(dto: CreateFavoriteDto): Promise<Favorite> {
    return this.favoriteRepository.create(dto);
  }

  async deleteFavorite(userId: number, recipeId: number): Promise<void> {
    await this.findByUserAndRecipe(userId, recipeId);
    await this.favoriteRepository.delete(userId, recipeId);
  }
}