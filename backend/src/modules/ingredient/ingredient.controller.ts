import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto, UpdateIngredientDto } from './dto/ingredient.dto';
import { IIngredient } from './interfaces/ingredient.interface';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Post()
  async create(@Body() dto: CreateIngredientDto): Promise<IIngredient> {
    return this.ingredientService.createIngredient(dto);
  }

  @Get()
  async findAll(): Promise<IIngredient[]> {
    return this.ingredientService.getAllIngredients();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IIngredient> {
    return this.ingredientService.getIngredientById(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateIngredientDto): Promise<IIngredient> {
    return this.ingredientService.updateIngredient(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.ingredientService.deleteIngredient(id);
  }
}
