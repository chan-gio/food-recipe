import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { IIngredientService } from '../../common/interfaces/ingredient.service.interface';
import { Response } from '../../common/types/response.type';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dtos/create-ingredient.dto';
import { UpdateIngredientDto } from '../dtos/update-ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(
    @Inject('IIngredientService')
    private readonly ingredientService: IIngredientService) {}

  @Get()
  async getAllIngredients(): Promise<Response<Ingredient[]>> {
    const data = await this.ingredientService.getAllIngredients();
    return { data, message: 'Ingredients retrieved successfully', code: 200 };
  }

  @Get(':id')
  async getIngredientById(@Param('id', ParseIntPipe) id: number): Promise<Response<Ingredient>> {
    const data = await this.ingredientService.getIngredientById(id);
    return { data, message: 'Ingredient retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createIngredient(@Body() dto: CreateIngredientDto): Promise<Response<Ingredient>> {
    const data = await this.ingredientService.createIngredient(dto);
    return { data, message: 'Ingredient created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateIngredient(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateIngredientDto): Promise<Response<Ingredient>> {
    const data = await this.ingredientService.updateIngredient(id, dto);
    return { data, message: 'Ingredient updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteIngredient(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.ingredientService.deleteIngredient(id);
    return { data: null, message: 'Ingredient deleted successfully', code: 200 };
  }
}