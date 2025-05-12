import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { IIngredientRepository } from '../../common/interfaces/ingredient.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class IngredientRepository implements IIngredientRepository {
  private readonly logger = new Logger(IngredientRepository.name);


  constructor(
    @InjectRepository(Ingredient)
    private readonly ingredientRepo: Repository<Ingredient>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Ingredient[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = ((page ?? 1) - 1) * (limit ?? 10);
    const [data, total] = await this.ingredientRepo.findAndCount({
      skip,
      take: limit,
      relations: ['recipes'],
    });
    return { data, total };
  }

  async findById(id: number): Promise<Ingredient | null> {
    return this.ingredientRepo.findOne({ where: { ingredient_id: id }, relations: ['recipes'] });
  }

    async findByName(name: string): Promise<Ingredient[]> {
      try {
        const ingredients = await this.ingredientRepo.find({
          where: { ingredient_name: Like(`%${name}%`) },
        });
        this.logger.log(`Fetched ingredients with name '${name}': ${JSON.stringify(ingredients)}`);
        return ingredients;
      } catch (error) {
        this.logger.error(`Failed to fetch ingredients with name '${name}': ${error.message}`, error.stack);
        throw error;
      }
    }

  async create(ingredient: Partial<Ingredient>): Promise<Ingredient> {
    const newIngredient = this.ingredientRepo.create(ingredient);
    return this.ingredientRepo.save(newIngredient);
  }

  async update(id: number, ingredient: Partial<Ingredient>): Promise<Ingredient> {
    await this.ingredientRepo.update(id, ingredient);
    const updatedIngredient = await this.findById(id);
    if (!updatedIngredient) {
      throw new Error(`Ingredient with id ${id} not found`);
    }
    return updatedIngredient;
  }

  async delete(id: number): Promise<void> {
    await this.ingredientRepo.delete(id);
  }
}