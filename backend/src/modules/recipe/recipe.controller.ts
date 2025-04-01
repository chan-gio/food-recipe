import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto, UpdateRecipeDto } from './dto/recipe.dto';
import { IRecipe } from './interfaces/recipe.interface';

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  create(@Body() dto: CreateRecipeDto): Promise<IRecipe> {
    return this.recipeService.createRecipe(dto);
  }

  @Get()
  findAll(): Promise<IRecipe[]> {
    return this.recipeService.getAllRecipes();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<IRecipe> {
    return this.recipeService.getRecipeById(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() dto: UpdateRecipeDto): Promise<IRecipe> {
    return this.recipeService.updateRecipe(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.recipeService.deleteRecipe(id);
  }
}
