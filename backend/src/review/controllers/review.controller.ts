import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject, Query } from '@nestjs/common';
import { IReviewService } from '../../common/interfaces/review.service.interface';
import { Response } from '../../common/types/response.type';
import { Review } from '../entities/review.entity';
import { CreateReviewDto } from '../dtos/create-review.dto';
import { UpdateReviewDto } from '../dtos/update-review.dto';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Controller('reviews')
export class ReviewController {
  constructor(
    @Inject('IReviewService')
    private readonly reviewService: IReviewService) {}

    @Get()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async findAll(@Query() paginationDto: PaginationDto): Promise<Response<Review[]>> {
      const { data, total } = await this.reviewService.findAll(paginationDto);
      return {
        data,
        meta: {
          total,
          page: paginationDto.page ?? 1,
          limit: paginationDto.limit ?? 10,
          totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
        },
        message: 'Reviews retrieved successfully',
        code: 200,
      };
    }

  @Get('user/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<Response<Review[]>> {
    const { data, total } = await this.reviewService.findByUserId(userId, paginationDto);
    return {
      data,
      meta: {
        total,
        page: paginationDto.page ?? 1,
        limit: paginationDto.limit ?? 10,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Reviews retrieved successfully',
      code: 200,
    };
  }

  @Get(':id')
  async getReviewById(@Param('id', ParseIntPipe) id: number): Promise<Response<Review>> {
    const data = await this.reviewService.getReviewById(id);
    return { data, message: 'Review retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createReview(@Body() dto: CreateReviewDto): Promise<Response<Review>> {
    const data = await this.reviewService.createReview(dto);
    return { data, message: 'Review created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateReview(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateReviewDto): Promise<Response<Review>> {
    const data = await this.reviewService.updateReview(id, dto);
    return { data, message: 'Review updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteReview(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.reviewService.deleteReview(id);
    return { data: null, message: 'Review deleted successfully', code: 200 };
  }
}