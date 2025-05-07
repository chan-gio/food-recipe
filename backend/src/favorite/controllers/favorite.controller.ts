import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { IFavoriteService } from '../../common/interfaces/favorite.service.interface';
import { Response } from '../../common/types/response.type';
import { Favorite } from '../entities/favorite.entity';
import { CreateFavoriteDto } from '../dtos/create-favorite.dto';

@Controller('favorites')
export class FavoriteController {
  constructor(
    @Inject('IFavoriteService')
    private readonly favoriteService: IFavoriteService,
  ) {}

  @Get()
  async getAllFavorites(): Promise<Response<Favorite[]>> {
    const data = await this.favoriteService.getAllFavorites();
    return { data, message: 'Favorites retrieved successfully', code: 200 };
  }

  @Get(':userId')
  @UsePipes(new ParseIntPipe())
  async findByUserId(
    @Param('userId') userId: number,
  ): Promise<Response<Favorite[]>> {
    const data = await this.favoriteService.findByUserId(userId);
    return { data, message: 'Favorites retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createFavorite(@Body() dto: CreateFavoriteDto): Promise<Response<Favorite>> {
    const data = await this.favoriteService.createFavorite(dto);
    return { data, message: 'Favorite created successfully', code: 201 };
  }

  @Delete(':userId/:recipeId')
  @UsePipes(new ParseIntPipe())
  async deleteFavorite(
    @Param('userId') userId: number,
    @Param('recipeId') recipeId: number,
  ): Promise<Response<null>> {
    await this.favoriteService.deleteFavorite(userId, recipeId);
    return { data: null, message: 'Favorite deleted successfully', code: 200 };
  }
}