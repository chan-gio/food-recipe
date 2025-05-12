import { Review } from '../../review/entities/review.entity';
import { CreateReviewDto } from '../../review/dtos/create-review.dto';
import { UpdateReviewDto } from '../../review/dtos/update-review.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface IReviewService {
  findAll(paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }>;
  findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }>;
  getReviewById(id: number): Promise<Review>;
  createReview(dto: CreateReviewDto): Promise<Review>;
  updateReview(id: number, dto: UpdateReviewDto): Promise<Review>;
  deleteReview(id: number): Promise<void>;
}