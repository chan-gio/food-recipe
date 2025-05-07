import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Searches } from '../entities/searches.entity';
import { ISearchesRepository } from '../../common/interfaces/searches.repository.interface';

@Injectable()
export class SearchesRepository implements ISearchesRepository {
  constructor(
    @InjectRepository(Searches)
    private readonly searchesRepo: Repository<Searches>,
  ) {}

  async findAll(): Promise<Searches[]> {
    return this.searchesRepo.find({ relations: ['user', 'recipe'] });
  }

  async findByUserAndRecipe(userId: number, recipeId: number): Promise<Searches | null> {
    return this.searchesRepo.findOne({ where: { user_id: userId, recipe_id: recipeId }, relations: ['user', 'recipe'] });
  }

  async create(searches: Partial<Searches>): Promise<Searches> {
    const newSearches = this.searchesRepo.create(searches);
    return this.searchesRepo.save(newSearches);
  }

  async delete(userId: number, recipeId: number): Promise<void> {
    await this.searchesRepo.delete({ user_id: userId, recipe_id: recipeId });
  }
}