import { Injectable, Inject } from '@nestjs/common';
import { IIngredientRepository } from '../../common/interfaces/ingredient.repository.interface';
import { IIngredientService } from '../../common/interfaces/ingredient.service.interface';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../dtos/update-ingredient.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class IngredientService implements IIngredientService {
  constructor(
    @Inject('IIngredientRepository')
    private readonly ingredientRepository: IIngredientRepository,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Ingredient[]; total: number }> {
    return this.ingredientRepository.findAll(paginationDto);
  }

  async getIngredientById(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepository.findById(id);
    if (!ingredient) {
      throw new EntityNotFoundException('Ingredient', id);
    }
    return ingredient;
  }

    async findByName(name: string): Promise<Ingredient[]> {
      return this.ingredientRepository.findByName(name);
    }

  async createIngredient(dto: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientRepository.create(dto);
  }

  async updateIngredient(id: number, dto: UpdateIngredientDto): Promise<Ingredient> {
    await this.getIngredientById(id);
    return this.ingredientRepository.update(id, dto);
  }

  async deleteIngredient(id: number): Promise<void> {
    await this.getIngredientById(id);
    await this.ingredientRepository.delete(id);
  }
}