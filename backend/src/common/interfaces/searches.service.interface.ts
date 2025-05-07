import { Searches } from '../../searches/entities/searches.entity';
import { CreateSearchesDto } from '../../searches/dtos/create-searches.dto';

export interface ISearchesService {
  getAllSearches(): Promise<Searches[]>;
  getSearchesByUserAndRecipe(userId: number, recipeId: number): Promise<Searches>;
  createSearches(dto: CreateSearchesDto): Promise<Searches>;
  deleteSearches(userId: number, recipeId: number): Promise<void>;
}