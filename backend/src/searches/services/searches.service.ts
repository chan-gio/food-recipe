import { Inject, Injectable } from '@nestjs/common';
import { ISearchesRepository } from '../../common/interfaces/searches.repository.interface';
import { ISearchesService } from '../../common/interfaces/searches.service.interface';
import { Searches } from '../entities/searches.entity';
import { CreateSearchesDto } from '../dtos/create-searches.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';

@Injectable()
export class SearchesService implements ISearchesService {
  constructor(
    @Inject('ISearchesRepository')
    private readonly searchesRepository: ISearchesRepository) {}

  async getAllSearches(): Promise<Searches[]> {
    return this.searchesRepository.findAll();
  }

  async getSearchesByUserAndRecipe(userId: number, recipeId: number): Promise<Searches> {
    const searches = await this.searchesRepository.findByUserAndRecipe(userId, recipeId);
    if (!searches) {
      throw new EntityNotFoundException('Searches', userId);
    }
    return searches;
  }

  async createSearches(dto: CreateSearchesDto): Promise<Searches> {
    return this.searchesRepository.create(dto);
  }

  async deleteSearches(userId: number, recipeId: number): Promise<void> {
    await this.getSearchesByUserAndRecipe(userId, recipeId);
    await this.searchesRepository.delete(userId, recipeId);
  }
}