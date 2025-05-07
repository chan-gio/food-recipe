import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from '../entities/review.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { User } from '../../user/entities/user.entity';
import { IReviewRepository } from '../../common/interfaces/review.repository.interface';
import { CreateReviewDto } from '../dtos/create-review.dto';

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
  ) {}

  async findAll(): Promise<Review[]> {
    try {
      return await this.reviewRepo.find({
        relations: ['recipe', 'user'],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch all reviews: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<Review | null> {
    try {
      return await this.reviewRepo.findOne({
        where: { review_id: id },
        relations: ['recipe', 'user'],
      });
    } catch (error) {
      this.logger.error(`Failed to fetch review with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    try {
      if (!dto.recipe_id || !dto.user_id) {
        throw new BadRequestException('recipe_id and user_id are required');
      }
      if (dto.rating < 1 || dto.rating > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      const recipe = await this.recipeRepo.findOneOrFail({ where: { recipe_id: dto.recipe_id } });
      this.logger.log(`Fetched recipe: ${JSON.stringify(recipe)}`);

      const user = await this.userRepo.findOneOrFail({ where: { user_id: dto.user_id } });
      this.logger.log(`Fetched user: ${JSON.stringify(user)}`);

      const newReview = new Review();
      newReview.rating = dto.rating;
      newReview.comment = dto.comment ?? '';
      newReview.recipe = recipe;
      newReview.user = user;

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
    try {
      const result = await this.reviewRepo.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Review with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete review with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}