import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Raw, Repository } from 'typeorm';
import { Recipe } from '../entities/recipe.entity';
import { IRecipeRepository } from '../../common/interfaces/recipe.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';
import { FilterRecipeDto } from '../dtos/filter-recipe.dto';
import { TopContributor } from 'src/common/types/response.type';

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
        relations: ['user'],
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

  async filterRecipes(filterDto: FilterRecipeDto, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const { categoryIds, ingredientIds } = filterDto;
      const skip = ((page ?? 1) - 1) * ( limit ?? 10);

      let where: any = {};

      // Log the filtering conditions
      this.logger.log(`Filtering recipes with categoryIds: ${JSON.stringify(categoryIds)}, ingredientIds: ${JSON.stringify(ingredientIds)}`);

      // Filter by categoryIds using a subquery
      if (categoryIds && categoryIds.length > 0) {
        where = {
          ...where,
          recipe_id: Raw((alias) => {
            const categoryIdsString = categoryIds.join(',');
            return `${alias} IN (
              SELECT rc.recipe_id_for_category
              FROM RecipeCategory rc
              WHERE rc.category_id_for_recipe IN (${categoryIdsString})
              GROUP BY rc.recipe_id_for_category
              HAVING COUNT(DISTINCT rc.category_id_for_recipe) = ${categoryIds.length}
            )`;
          }),
        };
      }

      // Filter by ingredientIds using a subquery
      if (ingredientIds && ingredientIds.length > 0) {
        where = {
          ...where,
          recipe_id: Raw((alias) => {
            const ingredientIdsString = ingredientIds.join(',');
            return `${alias} IN (
              SELECT h.recipe_id_for_ingredient
              FROM has h
              WHERE h.ingredient_id_for_recipe IN (${ingredientIdsString})
              GROUP BY h.recipe_id_for_ingredient
              HAVING COUNT(DISTINCT h.ingredient_id_for_recipe) = ${ingredientIds.length}
            )`;
          }),
        };
      }

      const [data, total] = await this.recipeRepo.findAndCount({
        where,
        skip,
        take: limit,
        order: { created_at: 'DESC' },
        relations: ['user', 'categories', 'ingredients', 'instructions', 'reviews', 'reviews.user'],
      });

      this.logger.log(`Filtered ${data.length} recipes (page ${page}, limit ${limit}, total ${total})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to filter recipes: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getTopContributors(limit: number): Promise<TopContributor[]> {
    try {
      const topContributors = await this.recipeRepo
        .createQueryBuilder('recipe')
        .select('recipe.user_id', 'userId')
        .addSelect('user.full_name', 'fullName')
        .addSelect('COUNT(recipe.recipe_id)', 'recipeCount')
        .leftJoin('recipe.user', 'user')
        .groupBy('recipe.user_id')
        .addGroupBy('user.full_name')
        .orderBy('recipeCount', 'DESC')
        .limit(limit)
        .getRawMany();

      const result = topContributors.map((entry) => ({
        userId: entry.userId,
        fullName: entry.fullName || 'Unknown User',
        recipeCount: parseInt(entry.recipeCount, 10),
      }));

      this.logger.log(`Fetched top ${limit} contributors: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to fetch top contributors: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getMostFavoritedRecipes(limit: number): Promise<Recipe[]> {
    try {
      const queryBuilder = this.recipeRepo
        .createQueryBuilder('recipe')
        .leftJoin('recipe.favorites', 'favorites')
        .groupBy('recipe.recipe_id')
        .orderBy('COUNT(favorites.user_id)', 'DESC')
        .limit(limit)
        .select([
          'recipe.recipe_id',
          'recipe.recipe_name',
          'recipe.images',
          'COUNT(favorites.user_id) as favoriteCount',
        ])
  
      // Use getRawAndEntities to debug
      const { entities } = await queryBuilder.getRawAndEntities();

      return entities;
    } catch (error) {
      throw error;
    }
  }

  async searchRecipesByName(name: string, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = paginationDto;
      const skip = (page - 1) * limit;
  
      const queryBuilder = this.recipeRepo
        .createQueryBuilder('recipe')
        .where('recipe.recipe_name LIKE :name', { name: `%${name}%` }) 
        .skip(skip)
        .take(limit)
        .orderBy('recipe.created_at', 'DESC')
        // .loadAllRelationIds({ relations: ['user', 'categories', 'ingredients', 'instructions', 'reviews', 'reviews.user'] });
  
      const [data, total] = await queryBuilder.getManyAndCount();
  
      return { data, total };
    } catch (error) {
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