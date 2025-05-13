import { Review } from '../../review/entities/review.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IReviewRepository {
  findAll(paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }>;
  findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }>;
  findByRecipeId(recipeId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }>;
  findById(id: number): Promise<Review | null>;
  create(review: Partial<Review>): Promise<Review>;
  update(id: number, review: Partial<Review>): Promise<Review>;
  delete(id: number): Promise<void>;
}