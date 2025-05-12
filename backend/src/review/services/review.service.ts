import { Inject, Injectable } from '@nestjs/common';
import { IReviewRepository } from '../../common/interfaces/review.repository.interface';
import { IReviewService } from '../../common/interfaces/review.service.interface';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class ReviewService implements IReviewService {
  constructor(
    @Inject('IReviewRepository')
    private readonly reviewRepository: IReviewRepository) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }> {
    return this.reviewRepository.findAll(paginationDto);
  }

  async findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Review[]; total: number }> {
    return this.reviewRepository.findByUserId(userId, paginationDto);
  }

  async getReviewById(id: number): Promise<Review> {
    const review = await this.reviewRepository.findById(id);
    if (!review) {
      throw new EntityNotFoundException('Review', id);
    }
    return review;
  }

  async createReview(dto: CreateReviewDto): Promise<Review> {
    return this.reviewRepository.create(dto);
  }

  async updateReview(id: number, dto: UpdateReviewDto): Promise<Review> {
    await this.getReviewById(id);
    return this.reviewRepository.update(id, dto);
  }

  async deleteReview(id: number): Promise<void> {
    await this.getReviewById(id);
    await this.reviewRepository.delete(id);
  }
}