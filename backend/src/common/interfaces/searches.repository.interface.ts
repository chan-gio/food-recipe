import { Searches } from '../../searches/entities/searches.entity';

export interface ISearchesRepository {
  findAll(): Promise<Searches[]>;
  findByUserAndRecipe(userId: number, recipeId: number): Promise<Searches | null>;
  create(searches: Partial<Searches>): Promise<Searches>;
  delete(userId: number, recipeId: number): Promise<void>;
}