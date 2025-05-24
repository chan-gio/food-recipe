import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFiles, Inject, Query, BadRequestException, Logger } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { IRecipeService } from '../../common/interfaces/recipe.service.interface';
import { Response, TopContributor } from '../../common/types/response.type';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../dtos/update-recipe.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { PaginationDto } from 'src/common/dots/pagination.dto';
import { FilterRecipeDto } from 'src/recipe/dtos/filter-recipe.dto';

@Controller('recipes')
export class RecipeController {
  private readonly logger = new Logger(RecipeController.name);

  constructor(
    @Inject('IRecipeService')
    private readonly recipeService: IRecipeService,
  ) { }

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

  @Get('filter')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true, transformOptions: { enableImplicitConversion: true } }))
  async filterRecipes(
    @Query() filterDto: FilterRecipeDto,
    @Query() paginationDto: PaginationDto,
    @Query('categoryIds') rawCategoryIds?: string | string[],
    @Query('ingredientIds') rawIngredientIds?: string | string[],
  ): Promise<Response<Recipe[]>> {
    console.log('GET /recipes/filter - Incoming request');
    console.log('Controller - Raw Query Parameters (before DTO):', { categoryIds: rawCategoryIds, ingredientIds: rawIngredientIds, page: paginationDto.page, limit: paginationDto.limit });

    // Manually convert single values to arrays if necessary
    if (rawCategoryIds) {
      filterDto.categoryIds = Array.isArray(rawCategoryIds) ? rawCategoryIds.map(id => parseInt(id, 10)) : [parseInt(rawCategoryIds, 10)];
    }
    if (rawIngredientIds) {
      filterDto.ingredientIds = Array.isArray(rawIngredientIds) ? rawIngredientIds.map(id => parseInt(id, 10)) : [parseInt(rawIngredientIds, 10)];
    }

    console.log('Controller - Transformed DTO:', JSON.stringify(filterDto, null, 2));

    // Manually validate categoryIds and ingredientIds
    if (filterDto.categoryIds && filterDto.categoryIds.some(id => !Number.isInteger(id) || id < 1)) {
      throw new BadRequestException('Each value in categoryIds must be an integer number greater than or equal to 1');
    }
    if (filterDto.ingredientIds && filterDto.ingredientIds.some(id => !Number.isInteger(id) || id < 1)) {
      throw new BadRequestException('Each value in ingredientIds must be an integer number greater than or equal to 1');
    }

    const page = paginationDto.page !== undefined && !isNaN(paginationDto.page) && paginationDto.page >= 1 ? paginationDto.page : 1;
    const limit = paginationDto.limit !== undefined && !isNaN(paginationDto.limit) && paginationDto.limit >= 1 ? paginationDto.limit : 10;

    const { data, total } = await this.recipeService.filterRecipes(filterDto, paginationDto);
    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      message: 'Filtered recipes retrieved successfully',
      code: 200,
    };
  }

  @Get('users/top-contributors')
  async getTopContributors(): Promise<Response<TopContributor[]>> {
    const data = await this.recipeService.getTopContributors(3); // Limit to top 3
    return {
      data,
      message: 'Top contributors retrieved successfully',
      code: 200,
    };
  }

  @Get('most-favorited')
  async getMostFavoritedRecipes(): Promise<Response<Recipe[]>> {
    const data = await this.recipeService.getMostFavoritedRecipes(5);
    return {
      data,
      message: 'Most favorited recipes retrieved successfully',
      code: 200,
    };
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async searchRecipesByName(
    @Query('name') name: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<Response<Recipe[]>> {

    if (!name || typeof name !== 'string' || name.trim() === '') {
      throw new BadRequestException('Query parameter "name" must be a non-empty string');
    }

    const { data, total } = await this.recipeService.searchRecipesByName(name, paginationDto);
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
  async updateRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body('dto') dto: string, // Parse JSON string from FormData
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ): Promise<Response<Recipe>> {
    this.logger.log(`Received files: ${files ? files.map(f => f.originalname).join(', ') : 'none'}`);

    // Check if dto is missing or invalid
    if (!dto || dto === 'undefined' || dto.trim() === '') {
      throw new BadRequestException('DTO is missing or invalid');
    }

    let parsedDto: UpdateRecipeDto;
    try {
      const dtoObj = JSON.parse(dto);
      // Manually parse numeric fields to ensure correct types
      if (dtoObj.servings && (isNaN(parseInt(dtoObj.servings, 10)) || parseInt(dtoObj.servings, 10) < 1)) {
        throw new BadRequestException('servings must be a valid number greater than 0');
      }
      if (dtoObj.prep_time && (isNaN(parseInt(dtoObj.prep_time, 10)) || parseInt(dtoObj.prep_time, 10) < 0)) {
        throw new BadRequestException('prep_time must be a valid number greater than or equal to 0');
      }
      if (dtoObj.cook_time && (isNaN(parseInt(dtoObj.cook_time, 10)) || parseInt(dtoObj.cook_time, 10) < 0)) {
        throw new BadRequestException('cook_time must be a valid number greater than or equal to 0');
      }

      parsedDto = plainToClass(UpdateRecipeDto, {
        ...dtoObj,
        servings: dtoObj.servings ? parseInt(dtoObj.servings, 10) : undefined,
        prep_time: dtoObj.prep_time ? parseInt(dtoObj.prep_time, 10) : undefined,
        cook_time: dtoObj.cook_time ? parseInt(dtoObj.cook_time, 10) : undefined,
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
    const data = await this.recipeService.updateRecipe(id, parsedDto, {
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