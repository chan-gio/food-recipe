import { Review } from '../../review/entities/review.entity';

export interface IReviewRepository {
  findAll(): Promise<Review[]>;
  findById(id: number): Promise<Review | null>;
  create(review: Partial<Review>): Promise<Review>;
  update(id: number, review: Partial<Review>): Promise<Review>;
  delete(id: number): Promise<void>;
}