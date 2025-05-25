import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { User } from '../../user/entities/user.entity';
import { IReviewRepository } from '../../common/interfaces/review.repository.interface';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class ReviewRepository implements IReviewRepository {
  private readonly logger = new Logger(ReviewRepository.name);

  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Recipe)
    private readonly recipeRepo: Repository<Recipe>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * (limit ?? 10);

      const query = this.reviewRepo.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.recipe', 'recipe')
        .where('review.parent IS NULL')
        .skip(skip)
        .take(limit)
        .orderBy('review.created_at', 'DESC');

      const [topLevelReviews, total] = await query.getManyAndCount();

      const data = await Promise.all(
        topLevelReviews.map(async (review) => {
          return await this.fetchReviewWithReplies(review);
        })
      );

      this.logger.log(`Fetched ${data.length} top-level reviews (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all reviews: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * (limit ?? 10);

      const query = this.reviewRepo.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.recipe', 'recipe')
        .where('review.user_id = :userId', { userId })
        .andWhere('review.parent IS NULL')
        .skip(skip)
        .take(limit)
        .orderBy('review.created_at', 'DESC');

      const [topLevelReviews, total] = await query.getManyAndCount();

      const data = await Promise.all(
        topLevelReviews.map(async (review) => {
          return await this.fetchReviewWithReplies(review);
        })
      );

      this.logger.log(`Fetched ${data.length} reviews for user ${userId} (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch reviews for user ${userId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByRecipeId(recipeId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * (limit ?? 10);

      const query = this.reviewRepo.createQueryBuilder('review')
        .leftJoinAndSelect('review.user', 'user')
        .leftJoinAndSelect('review.recipe', 'recipe')
        .where('review.recipe_id = :recipeId', { recipeId })
        .andWhere('review.parent IS NULL')
        .skip(skip)
        .take(limit)
        .orderBy('review.created_at', 'DESC');

      const [topLevelReviews, total] = await query.getManyAndCount();

      const data = await Promise.all(
        topLevelReviews.map(async (review) => {
          return await this.fetchReviewWithReplies(review);
        })
      );

      this.logger.log(`Fetched ${data.length} reviews for recipe ${recipeId} (page ${page}, limit ${limit})`);
      return { data, total };
    } catch (error) {
      this.logger.error(`Failed to fetch reviews for recipe ${recipeId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<Review | null> {
    try {
      const review = await this.reviewRepo.findOne({
        where: { review_id: id },
        relations: ['recipe', 'user'],
      });
      if (review) {
        return await this.fetchReviewWithReplies(review);
      }
      return null;
    } catch (error) {
      this.logger.error(`Failed to fetch review with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async fetchReviewWithReplies(review: Review): Promise<Review> {
    const replies = await this.reviewRepo.find({
      where: { parent: { review_id: review.review_id } },
      relations: ['recipe', 'user'],
    });

    review.replies = await Promise.all(
      replies.map(async (reply) => {
        return await this.fetchReviewWithReplies(reply);
      })
    );

    return review;
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    try {
      if (!dto.recipe_id || !dto.user_id) {
        throw new BadRequestException('recipe_id and user_id are required');
      }

      const recipe = await this.recipeRepo.findOne({ where: { recipe_id: dto.recipe_id } });
      if (!recipe) {
        throw new NotFoundException(`Recipe with ID ${dto.recipe_id} not found`);
      }
      this.logger.log(`Fetched recipe: ${JSON.stringify(recipe)}`);

      const user = await this.userRepo.findOne({ where: { user_id: dto.user_id } });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.user_id} not found`);
      }
      this.logger.log(`Fetched user: ${JSON.stringify(user)}`);

      const newReview = this.reviewRepo.create({
        recipe,
        user,
        comment: dto.comment ?? '',
        rating: dto.parent_review_id ? (dto.rating !== undefined ? dto.rating : null) : dto.rating,
      });

      if (!dto.parent_review_id) {
        newReview.parent = null;
        if (dto.rating === undefined) {
          throw new BadRequestException('Rating is required for top-level reviews');
        }
        if (dto.rating < 1 || dto.rating > 5) {
          throw new BadRequestException('Rating must be between 1 and 5');
        }
      } else {
        const parentReview = await this.reviewRepo.findOne({
          where: { review_id: dto.parent_review_id },
          relations: ['recipe'],
        });
        if (!parentReview) {
          throw new NotFoundException(`Parent review with ID ${dto.parent_review_id} not found`);
        }
        if (parentReview.recipe.recipe_id !== dto.recipe_id) {
          throw new BadRequestException('Parent review must belong to the same recipe');
        }
        newReview.parent = parentReview;
      }

      this.logger.log(`Creating review: ${JSON.stringify(newReview)}`);

      return await this.reviewRepo.save(newReview);
    } catch (error) {
      this.logger.error(`Failed to create review: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, review: Partial<Review>): Promise<Review> {
    try {
      await this.reviewRepo.update(id, review);
      const updatedReview = await this.findById(id);
      if (!updatedReview) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
      return updatedReview;
    } catch (error) {
      this.logger.error(`Failed to update review with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const review = await queryRunner.manager.findOne(Review, {
        where: { review_id: id },
        relations: ['replies'], // Load direct replies for verification
      });
      if (!review) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }

      await this.deleteReviewRecursively(id, queryRunner);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async deleteReviewRecursively(reviewId: number, queryRunner: any): Promise<void> {
    const childReviews = await queryRunner.manager.find(Review, {
      where: { parent: { review_id: reviewId } },
    });

    for (const child of childReviews) {
      await this.deleteReviewRecursively(child.review_id, queryRunner);
    }

    await queryRunner.manager.delete(Review, reviewId);
  }
}