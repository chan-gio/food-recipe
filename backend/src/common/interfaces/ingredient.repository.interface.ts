import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IIngredientRepository {
  findAll(paginationDto: PaginationDto): Promise< { data: Ingredient[]; total: number }>;
  findById(id: number): Promise<Ingredient | null>;
  findByName(name: string): Promise<Ingredient[]>;
  create(ingredient: Partial<Ingredient>): Promise<Ingredient>;
  update(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient>;
  delete(id: number): Promise<void>;
}