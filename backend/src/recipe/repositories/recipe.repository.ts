import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { IRecipeRepository } from '../../common/interfaces/recipe.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class RecipeRepository implements IRecipeRepository {
  private readonly logger = new Logger(RecipeRepository.name);

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * ( limit ?? 10);
      const [data, total] = await this.recipeRepo.findAndCount({
        skip,
        take: limit,
        relations: ['user', 'ingredients', 'categories', 'instructions', 'reviews', 'favorites', 'searches'],
      });
      this.logger.log(`Fetched ${data.length} recipes (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all recipes: ${error.message}`, error.stack);
      throw error;
    }
  }


  async findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * ( limit ?? 10);
      const [data, total] = await this.recipeRepo.findAndCount({
        where: { user: { user_id: userId } },
        skip,
        take: limit,
        relations: ['user', 'ingredients', 'categories', 'instructions', 'reviews', 'favorites', 'searches'],
      });
      this.logger.log(`Fetched ${data.length} recipes (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all recipes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<Recipe | null> {
    try {
      return await this.recipeRepo.findOne({
        where: { recipe_id: id },
        relations: ['user', 'ingredients', 'categories', 'instructions', 'reviews', 'favorites'],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch recipe with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      const newRecipe = this.recipeRepo.create(recipe);
      const savedRecipe = await this.recipeRepo.save(newRecipe);
      const fetchedRecipe = await this.findById(savedRecipe.recipe_id);
      if (!fetchedRecipe) {
        throw new Error(`Failed to fetch newly created recipe with ID ${savedRecipe.recipe_id}`);
      }
      return fetchedRecipe;
    } catch (error) {
      this.logger.error(`Failed to create recipe: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, recipe: Partial<Recipe>): Promise<Recipe> {
    try {
      await this.recipeRepo.update(id, recipe);
      const updatedRecipe = await this.findById(id);
      if (!updatedRecipe) {
        throw new Error(`Recipe with ID ${id} not found`);
      }
      return updatedRecipe;
    } catch (error) {
      this.logger.error(`Failed to update recipe with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.recipeRepo.delete(id);
      if (result.affected === 0) {
        throw new Error(`Recipe with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete recipe with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}