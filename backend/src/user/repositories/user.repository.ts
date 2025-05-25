import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from '../../common/interfaces/user.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: User[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const skip = (page - 1) * limit;
      const [data, total] = await this.userRepo.findAndCount({
        skip,
        take: limit,
        relations: ['recipes', 'reviews', 'favorites', 'searches'],
      });
      this.logger.log(`Fetched ${data.length} users (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all users: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.userRepo.findOne({
        where: { user_id: id },
        relations: ['recipes', 'reviews', 'favorites', 'searches'],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findBySigninAccount(signin_account: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { signin_account } });
    } catch (error) {
      this.logger.error(`Failed to fetch user with signin_account ${signin_account}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepo.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Failed to fetch user with email ${email}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async searchByFullNameAndEmail(
    query: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: User[]; total: number }> {
    try {
      const { page = 1, limit = 10 } = paginationDto || {};
      const skip = (page - 1) * limit;

      const queryBuilder = this.userRepo.createQueryBuilder('user');

      if (query) {
        queryBuilder.where(
          'LOWER(user.signin_account) LIKE LOWER(:query) OR LOWER(user.email) LIKE LOWER(:query)',
          { query: `%${query}%` },
        );
      }

      queryBuilder.skip(skip).take(limit);

      const [data, total] = await queryBuilder.getManyAndCount();

      this.logger.log(`Fetched ${data.length} users for search (query: ${query || 'N/A'}, page: ${page}, limit: ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to search users (query: ${query || 'N/A'}): ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(user: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (error) {
      this.logger.error(`Failed to create user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Step 1: Delete all recipes created by the user (this will also delete related reviews, etc.)
      const recipes = await queryRunner.manager.query(
        `SELECT recipe_id FROM Recipe WHERE user_id = ?`,
        [id]
      );

      for (const recipe of recipes) {
        const recipeId = recipe.recipe_id;
        // Delete related records for the recipe
        await this.deleteReviewsRecursively(recipeId, queryRunner);
        this.logger.log(`Deleted all reviews for recipe ID ${recipeId}`);

        await queryRunner.manager.query(
          `DELETE FROM Has WHERE recipe_id_for_ingredient = ?`,
          [recipeId],
        );
        this.logger.log(`Deleted recipe-ingredient relationships for recipe ID ${recipeId}`);

        await queryRunner.manager.query(
          `DELETE FROM RecipeCategory WHERE recipe_id_for_category = ?`,
          [recipeId],
        );
        this.logger.log(`Deleted recipe-category relationships for recipe ID ${recipeId}`);

        await queryRunner.manager.query(
          `DELETE FROM Instruction WHERE recipe_id = ?`,
          [recipeId],
        );
        this.logger.log(`Deleted instructions for recipe ID ${recipeId}`);

        await queryRunner.manager.query(
          `DELETE FROM Favorite WHERE recipe_id = ?`,
          [recipeId],
        );
        this.logger.log(`Deleted favorites for recipe ID ${recipeId}`);

        await queryRunner.manager.query(
          `DELETE FROM Recipe WHERE recipe_id = ?`,
          [recipeId],
        );
        this.logger.log(`Deleted recipe ID ${recipeId}`);
      }

      // Step 2: Delete reviews directly created by the user (not associated with recipes already deleted)
      await this.deleteReviewsByUserRecursively(id, queryRunner);
      this.logger.log(`Deleted all reviews created by user ID ${id}`);

      // Step 3: Delete other related records
      // Delete from Favorite (user's favorites)
      await queryRunner.manager.query(
        `DELETE FROM Favorite WHERE user_id = ?`,
        [id],
      );
      this.logger.log(`Deleted favorites for user ID ${id}`);

      // Delete from Searches
      await queryRunner.manager.query(
        `DELETE FROM Searches WHERE user_id = ?`,
        [id],
      );
      this.logger.log(`Deleted searches for user ID ${id}`);

      // Step 4: Delete the user
      const result = await queryRunner.manager.delete(User, id);
      if (result.affected === 0) {
        throw new Error(`User with ID ${id} not found`);
      }

      await queryRunner.commitTransaction();
      this.logger.log(`Successfully deleted user with ID ${id}`);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(`Failed to delete user with ID ${id}: ${error.message}`, error.stack);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Recursive function to delete reviews and their child reviews for a recipe
  private async deleteReviewsRecursively(recipeId: number, queryRunner: any): Promise<void> {
    const reviews = await queryRunner.manager.query(
      `SELECT review_id FROM Review WHERE recipe_id = ?`,
      [recipeId]
    );

    if (!reviews || reviews.length === 0) {
      return;
    }

    for (const review of reviews) {
      const reviewId = review.review_id;
      await this.deleteChildReviews(reviewId, queryRunner);
      await queryRunner.manager.query(
        `DELETE FROM Review WHERE review_id = ?`,
        [reviewId]
      );
      this.logger.log(`Deleted review ID ${reviewId} for recipe ID ${recipeId}`);
    }
  }

  // Recursive function to delete reviews and their child reviews for a user
  private async deleteReviewsByUserRecursively(userId: number, queryRunner: any): Promise<void> {
    const reviews = await queryRunner.manager.query(
      `SELECT review_id FROM Review WHERE user_id = ?`,
      [userId]
    );

    if (!reviews || reviews.length === 0) {
      return;
    }

    for (const review of reviews) {
      const reviewId = review.review_id;
      await this.deleteChildReviews(reviewId, queryRunner);
      await queryRunner.manager.query(
        `DELETE FROM Review WHERE review_id = ?`,
        [reviewId]
      );
      this.logger.log(`Deleted review ID ${reviewId} created by user ID ${userId}`);
    }
  }

  // Helper function to delete child reviews recursively
  private async deleteChildReviews(reviewId: number, queryRunner: any): Promise<void> {
    const childReviews = await queryRunner.manager.query(
      `SELECT review_id FROM Review WHERE parent_review_id = ?`,
      [reviewId]
    );

    if (!childReviews || childReviews.length === 0) {
      return;
    }

    for (const childReview of childReviews) {
      const childReviewId = childReview.review_id;
      await this.deleteChildReviews(childReviewId, queryRunner);
      await queryRunner.manager.query(
        `DELETE FROM Review WHERE review_id = ?`,
        [childReviewId]
      );
      this.logger.log(`Deleted child review ID ${childReviewId}`);
    }
  }
}