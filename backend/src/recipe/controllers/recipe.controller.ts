import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Inject } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { IRecipeService } from '../../common/interfaces/recipe.service.interface';
import { Response } from '../../common/types/response.type';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../dtos/update-recipe.dto';
import { UploadMediaDto } from '../dtos/upload-media.dto';

@Controller('recipes')
export class RecipeController {
  constructor(
    @Inject('IRecipeService')
    private readonly recipeService: IRecipeService) {}

  @Get()
  async getAllRecipes(): Promise<Response<Recipe[]>> {
    const data = await this.recipeService.getAllRecipes();
    return { data, message: 'Recipes retrieved successfully', code: 200 };
  }

  @Get(':id')
  async getRecipeById(@Param('id', ParseIntPipe) id: number): Promise<Response<Recipe>> {
    const data = await this.recipeService.getRecipeById(id);
    return { data, message: 'Recipe retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createRecipe(@Body() dto: CreateRecipeDto & { user_id: number }): Promise<Response<Recipe>> {
    const data = await this.recipeService.createRecipe(dto, dto.user_id);
    return { data, message: 'Recipe created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRecipe(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRecipeDto): Promise<Response<Recipe>> {
    const data = await this.recipeService.updateRecipe(id, dto);
    return { data, message: 'Recipe updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteRecipe(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.recipeService.deleteRecipe(id);
    return { data: null, message: 'Recipe deleted successfully', code: 200 };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async uploadMedia(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadMediaDto): Promise<Response<string>> {
    const data = await this.recipeService.uploadMedia(file, dto);
    return { data, message: 'Media uploaded successfully', code: 200 };
  }
}