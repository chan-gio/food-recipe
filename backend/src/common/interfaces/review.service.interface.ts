import { Review } from '../../review/entities/review.entity';
import { CreateReviewDto } from '../../review/dtos/create-review.dto';
import { UpdateReviewDto } from '../../review/dtos/update-review.dto';

export interface IReviewService {
  getAllReviews(): Promise<Review[]>;
  getReviewById(id: number): Promise<Review>;
  createReview(dto: CreateReviewDto): Promise<Review>;
  updateReview(id: number, dto: UpdateReviewDto): Promise<Review>;
  deleteReview(id: number): Promise<void>;
}