import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from '../entities/favorite.entity';
import { IFavoriteRepository } from '../../common/interfaces/favorite.repository.interface';

@Injectable()
export class FavoriteRepository implements IFavoriteRepository {
  private readonly logger = new Logger(FavoriteRepository.name);

  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepo: Repository<Favorite>,
  ) {}

  async findAll(): Promise<Favorite[]> {
    try {
      return await this.favoriteRepo.find({ relations: ['user', 'recipe'] });
    } catch (error) {
      this.logger.error(`Failed to fetch all favorites: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUserId(userId: number): Promise<Favorite[]> {
    try {
      const favorites = await this.favoriteRepo.find({
        where: { user_id: userId },
        relations: ['user', 'recipe'],
      });
      this.logger.log(`Fetched favorites for user ${userId}: ${JSON.stringify(favorites)}`);
      return favorites;
    } catch (error) {
      this.logger.error(`Failed to fetch favorites for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUserAndRecipe(userId: number, recipeId: number): Promise<Favorite | null> {
    try {
      const favorite = await this.favoriteRepo.findOne({
        where: { user_id: userId, recipe_id: recipeId },
        relations: ['user', 'recipe'],
      });
      this.logger.log(`Fetched favorite for user ${userId}, recipe ${recipeId}: ${JSON.stringify(favorite)}`);
      return favorite;
    } catch (error) {
      this.logger.error(`Failed to fetch favorite for user ${userId}, recipe ${recipeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(favorite: Partial<Favorite>): Promise<Favorite> {
    try {
      const newFavorite = this.favoriteRepo.create(favorite);
      return await this.favoriteRepo.save(newFavorite);
    } catch (error) {
      this.logger.error(`Failed to create favorite: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(userId: number, recipeId: number): Promise<void> {
    try {
      const result = await this.favoriteRepo.delete({ user_id: userId, recipe_id: recipeId });
      if (result.affected === 0) {
        throw new Error(`Favorite for user ${userId} and recipe ${recipeId} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete favorite: ${error.message}`, error.stack);
      throw error;
    }
  }
}