import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { CreateIngredientDto } from '../../ingredient/dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../../ingredient/dtos/update-ingredient.dto';
import { PaginationDto } from '../dots/pagination.dto';

export interface IIngredientService {
  findAll(paginationDto: PaginationDto): Promise< { data: Ingredient[]; total: number }>;
  getIngredientById(id: number): Promise<Ingredient>;
  findByName(name: string): Promise<Ingredient[]>;
  createIngredient(dto: CreateIngredientDto): Promise<Ingredient>;
  updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient>;
  deleteIngredient(id: number): Promise<void>;
}