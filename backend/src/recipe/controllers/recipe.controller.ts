import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFiles, Inject, Query, BadRequestException, Logger } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IRecipeService } from '../../common/interfaces/recipe.service.interface';
import { Response } from '../../common/types/response.type';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../dtos/update-recipe.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Controller('recipes')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);

  constructor(
    @Inject('IRecipeService')
    private readonly recipeService: IRecipeService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findAll(@Query() paginationDto: PaginationDto): Promise<Response<Recipe[]>> {
    const { data, total } = await this.recipeService.findAll(paginationDto);
    return {
      data,
      meta: {
        total,
        page: paginationDto.page ?? 1,
        limit: paginationDto.limit ?? 10,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Recipes retrieved successfully',
      code: 200,
    };
  }

  @Get('user/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationDto: PaginationDto,
  ): Promise<Response<Recipe[]>> {
    const { data, total } = await this.recipeService.findByUserId(userId, paginationDto);
    return {
      data,
      meta: {
        total,
        page: paginationDto.page ?? 1,
        limit: paginationDto.limit ?? 10,
        totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
      },
      message: 'Recipes retrieved successfully',
      code: 200,
    };
  }

  @Get(':id')
  async getRecipeById(@Param('id', ParseIntPipe) id: number): Promise<Response<Recipe>> {
    const data = await this.recipeService.getRecipeById(id);
    return { data, message: 'Recipe retrieved successfully', code: 200 };
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  async createRecipe(
    @Body('dto') dto: string, // Parse JSON string from FormData
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ): Promise<Response<Recipe>> {
    this.logger.log(`Received files: ${files ? files.map(f => f.originalname).join(', ') : 'none'}`);

    // Check if dto is missing or invalid
    if (!dto || dto === 'undefined' || dto.trim() === '') {
      throw new BadRequestException('DTO is missing or invalid');
    }

    let parsedDto: CreateRecipeDto;
    try {
      const dtoObj = JSON.parse(dto);
      // Manually parse numeric fields to ensure correct types
      if (dtoObj.servings == null || isNaN(parseInt(dtoObj.servings, 10))) {
        throw new BadRequestException('servings must be a valid number');
      }
      if (dtoObj.prep_time == null || isNaN(parseInt(dtoObj.prep_time, 10))) {
        throw new BadRequestException('prep_time must be a valid number');
      }
      if (dtoObj.cook_time == null || isNaN(parseInt(dtoObj.cook_time, 10))) {
        throw new BadRequestException('cook_time must be a valid number');
      }
      if (dtoObj.user_id == null || isNaN(parseInt(dtoObj.user_id, 10))) {
        throw new BadRequestException('user_id must be a valid number');
      }

      parsedDto = plainToClass(CreateRecipeDto, {
        ...dtoObj,
        servings: parseInt(dtoObj.servings, 10),
        prep_time: parseInt(dtoObj.prep_time, 10),
        cook_time: parseInt(dtoObj.cook_time, 10),
        user_id: parseInt(dtoObj.user_id, 10),
      });

      // Manually validate the DTO
      const errors = await validate(parsedDto);
      if (errors.length > 0) {
        const errorMessages = errors.map(error => Object.values(error.constraints || {}).join(', ')).join('; ');
        throw new BadRequestException(`Validation failed: ${errorMessages}`);
      }
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Invalid DTO format: ${error.message}`);
    }

    const imageFiles = files ? files.filter(file => file.mimetype.startsWith('image/')) : [];
    const videoFiles = files ? files.filter(file => file.mimetype.startsWith('video/')) : [];
    const data = await this.recipeService.createRecipe(parsedDto, parsedDto.user_id, {
      images: imageFiles,
      videos: videoFiles,
    });
    return { data, message: 'Recipe created successfully', code: 201 };
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 10)) // Allow up to 10 files
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecipeDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ): Promise<Response<Recipe>> {
    const imageFiles = files ? files.filter(file => file.mimetype.startsWith('image/')) : [];
    const videoFiles = files ? files.filter(file => file.mimetype.startsWith('video/')) : [];
    const data = await this.recipeService.updateRecipe(id, dto, {
      images: imageFiles,
      videos: videoFiles,
    });
    return { data, message: 'Recipe updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteRecipe(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.recipeService.deleteRecipe(id);
    return { data: null, message: 'Recipe deleted successfully', code: 200 };
  }
}