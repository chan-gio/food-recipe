import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { ISearchesService } from '../../common/interfaces/searches.service.interface';
import { Response } from '../../common/types/response.type';
import { Searches } from '../entities/searches.entity';
import { CreateSearchesDto } from '../dtos/create-searches.dto';

@Controller('searches')
export class SearchesController {
  constructor(
    @Inject('ISearchesService')
    private readonly searchesService: ISearchesService) {}

  @Get()
  async getAllSearches(): Promise<Response<Searches[]>> {
    const data = await this.searchesService.getAllSearches();
    return { data, message: 'Searches retrieved successfully', code: 200 };
  }

  @Get(':userId/:recipeId')
  async getSearchesByUserAndRecipe(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<Response<Searches>> {
    const data = await this.searchesService.getSearchesByUserAndRecipe(userId, recipeId);
    return { data, message: 'Search retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createSearches(@Body() dto: CreateSearchesDto): Promise<Response<Searches>> {
    const data = await this.searchesService.createSearches(dto);
    return { data, message: 'Search created successfully', code: 201 };
  }

  @Delete(':userId/:recipeId')
  async deleteSearches(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('recipeId', ParseIntPipe) recipeId: number,
  ): Promise<Response<null>> {
    await this.searchesService.deleteSearches(userId, recipeId);
    return { data: null, message: 'Search deleted successfully', code: 200 };
  }
}