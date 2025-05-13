import { Injectable, Inject, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { IRecipeRepository } from '../../common/interfaces/recipe.repository.interface';
import { Recipe } from '../entities/recipe.entity';
import { CreateRecipeDto } from '../dtos/create-recipe.dto';
import { UpdateRecipeDto } from '../dtos/update-recipe.dto';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { IRecipeService } from 'src/common/interfaces/recipe.service.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';
import { FilterRecipeDto } from 'src/recipe/dtos/filter-recipe.dto';

@Injectable()
export class RecipeService implements IRecipeService {
  private readonly logger = new Logger(RecipeService.name);

  constructor(
    @Inject('IRecipeRepository')
    private readonly recipeRepository: IRecipeRepository,
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @Inject('CLOUDINARY')
    private readonly cloudinary: any,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    return this.recipeRepository.findAll(paginationDto);
  }

  async findByUserId(userId: number, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    return this.recipeRepository.findByUserId(userId, paginationDto);
  }

  async getRecipeById(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepository.findById(id);
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async filterRecipes(filterDto: FilterRecipeDto, paginationDto: PaginationDto): Promise<{ data: Recipe[]; total: number }> {
    return this.recipeRepository.filterRecipes(filterDto, paginationDto);
  }

  async createRecipe(dto: CreateRecipeDto, userId: number, files?: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] }): Promise<Recipe> {
    try {
      this.logger.log(`Creating recipe with DTO: ${JSON.stringify(dto)}`);
      this.logger.log(`Files: images=${files?.images?.length || 0}, videos=${files?.videos?.length || 0}`);

      // Handle base64 images
      let imageUrls: string[] = [];
      if (dto.images && dto.images.length > 0) {
        imageUrls = await Promise.all(
          dto.images.map(async (base64Image) => {
            const result = await this.cloudinary.uploader.upload(base64Image, {
              folder: 'recipe_images',
              resource_type: 'image',
            });
            return result.secure_url;
          }),
        );
      }

      // Handle base64 videos
      let videoUrls: string[] = [];
      if (dto.videos && dto.videos.length > 0) {
        videoUrls = await Promise.all(
          dto.videos.map(async (base64Video) => {
            const result = await this.cloudinary.uploader.upload(base64Video, {
              folder: 'recipe_videos',
              resource_type: 'video',
            });
            return result.secure_url;
          }),
        );
      }

      // Handle file uploads for images
      if (files?.images && files.images.length > 0) {
        const fileImageUrls = await Promise.all(
          files.images.map(async (file) => {
            if (!file.buffer) {
              throw new BadRequestException('File buffer is missing for image upload');
            }
            this.logger.log(`Uploading image: ${file.originalname}`);
            if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
              throw new BadRequestException('Invalid image type');
            }
            if (file.size > 10000000) {
              throw new BadRequestException('Image size exceeds 10MB');
            }
            const result = await this.cloudinary.uploader.upload(
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
              {
                folder: 'recipe_images',
                resource_type: 'image',
              },
            );
            return result.secure_url;
          }),
        );
        imageUrls = [...imageUrls, ...fileImageUrls];
      }

      // Handle file uploads for videos
      if (files?.videos && files.videos.length > 0) {
        const fileVideoUrls = await Promise.all(
          files.videos.map(async (file) => {
            if (!file.buffer) {
              throw new BadRequestException('File buffer is missing for video upload');
            }
            this.logger.log(`Uploading video: ${file.originalname}`);
            if (!['video/mp4'].includes(file.mimetype)) {
              throw new BadRequestException('Invalid video type');
            }
            if (file.size > 10000000) {
              throw new BadRequestException('Video size exceeds 10MB');
            }
            const result = await this.cloudinary.uploader.upload(
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
              {
                folder: 'recipe_videos',
                resource_type: 'video',
              },
            );
            return result.secure_url;
          }),
        );
        videoUrls = [...videoUrls, ...fileVideoUrls];
      }

      let recipeId: number;

      // Start a transaction to insert the recipe and its relationships
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Insert the recipe into the Recipe table
        const recipeInsertResult = await queryRunner.manager.query(
          `INSERT INTO Recipe (recipe_name, description, recipe_type, servings, prep_time, cook_time, images, videos, user_id, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            dto.recipe_name,
            dto.description,
            dto.recipe_type,
            dto.servings,
            dto.prep_time,
            dto.cook_time,
            JSON.stringify(imageUrls),
            JSON.stringify(videoUrls),
            userId,
          ],
        );

        recipeId = recipeInsertResult.insertId;

        // Manually insert instructions
        if (dto.instructions && dto.instructions.length > 0) {
          for (const instructionDto of dto.instructions) {
            await queryRunner.manager.query(
              `INSERT INTO Instruction (step_number, description, recipe_id)
               VALUES (?, ?, ?)`,
              [instructionDto.step_number, instructionDto.description, recipeId],
            );
          }
        }

        // Manually insert ingredients into Has table using raw SQL
        if (dto.ingredients && dto.instructions.length > 0) {
          for (const ingredientDto of dto.ingredients) {
            await queryRunner.manager.query(
              `INSERT INTO Has (recipe_id_for_ingredient, ingredient_id_for_recipe)
               VALUES (?, ?)`,
              [recipeId, ingredientDto.ingredient_id],
            );
          }
        }

        // Manually insert categories into RecipeCategory table using raw SQL
        if (dto.categories && dto.categories.length > 0) {
          for (const categoryDto of dto.categories) {
            await queryRunner.manager.query(
              `INSERT INTO RecipeCategory (recipe_id_for_category, category_id_for_recipe)
               VALUES (?, ?)`,
              [recipeId, categoryDto.category_id],
            );
          }
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

      // Fetch the saved recipe with all relations using getRecipeById
      const fetchedRecipe = await this.getRecipeById(recipeId);
      this.logger.log(`Recipe created successfully: ${JSON.stringify(fetchedRecipe)}`);
      return fetchedRecipe;
    } catch (error) {
      this.logger.error(`Failed to create recipe: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to create recipe: ${error.message}`);
    }
  }

  async updateRecipe(id: number, dto: UpdateRecipeDto, files?: { images?: Express.Multer.File[]; videos?: Express.Multer.File[] }): Promise<Recipe> {
    try {
      this.logger.log(`Updating recipe ID ${id} with DTO: ${JSON.stringify(dto)}`);
      this.logger.log(`Files: images=${files?.images?.length || 0}, videos=${files?.videos?.length || 0}`);

      let imageUrls: string[] | undefined;
      if (dto.images && dto.images.length > 0) {
        imageUrls = await Promise.all(
          dto.images.map(async (base64Image) => {
            const result = await this.cloudinary.uploader.upload(base64Image, {
              folder: 'recipe_images',
              resource_type: 'image',
            });
            return result.secure_url;
          }),
        );
      }

      let videoUrls: string[] | undefined;
      if (dto.videos && dto.videos.length > 0) {
        videoUrls = await Promise.all(
          dto.videos.map(async (base64Video) => {
            const result = await this.cloudinary.uploader.upload(base64Video, {
              folder: 'recipe_videos',
              resource_type: 'video',
            });
            return result.secure_url;
          }),
        );
      }

      if (files?.images && files.images.length > 0) {
        const fileImageUrls = await Promise.all(
          files.images.map(async (file) => {
            if (!file.buffer) {
              throw new BadRequestException('File buffer is missing for image upload');
            }
            this.logger.log(`Uploading image: ${file.originalname}`);
            if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
              throw new BadRequestException('Invalid image type');
            }
            if (file.size > 10000000) {
              throw new BadRequestException('Image size exceeds 10MB');
            }
            const result = await this.cloudinary.uploader.upload(
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
              {
                folder: 'recipe_images',
                resource_type: 'image',
              },
            );
            return result.secure_url;
          }),
        );
        imageUrls = imageUrls ? [...imageUrls, ...fileImageUrls] : fileImageUrls;
      }

      if (files?.videos && files.videos.length > 0) {
        const fileVideoUrls = await Promise.all(
          files.videos.map(async (file) => {
            if (!file.buffer) {
              throw new BadRequestException('File buffer is missing for video upload');
            }
            this.logger.log(`Uploading video: ${file.originalname}`);
            if (!['video/mp4'].includes(file.mimetype)) {
              throw new BadRequestException('Invalid video type');
            }
            if (file.size > 10000000) {
              throw new BadRequestException('Video size exceeds 10MB');
            }
            const result = await this.cloudinary.uploader.upload(
              `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
              {
                folder: 'recipe_videos',
                resource_type: 'video',
              },
            );
            return result.secure_url;
          }),
        );
        videoUrls = videoUrls ? [...videoUrls, ...fileVideoUrls] : fileVideoUrls;
      }

      // Start a transaction to update the recipe and its relationships
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Check if the recipe exists
        const existingRecipe = await queryRunner.manager.query(
          `SELECT recipe_id FROM Recipe WHERE recipe_id = ?`,
          [id],
        );

        if (!existingRecipe || existingRecipe.length === 0) {
          throw new NotFoundException(`Recipe with id ${id} not found`);
        }

        // Update the recipe base data
        const updateData: { [key: string]: any } = {};
        const updateParams: any[] = [];
        let updateQuery = `UPDATE Recipe SET `;
        let hasFields = false;

        if (dto.recipe_name !== undefined) {
          updateQuery += `recipe_name = ?, `;
          updateParams.push(dto.recipe_name);
          hasFields = true;
        }
        if (dto.description !== undefined) {
          updateQuery += `description = ?, `;
          updateParams.push(dto.description);
          hasFields = true;
        }
        if (dto.recipe_type !== undefined) {
          updateQuery += `recipe_type = ?, `;
          updateParams.push(dto.recipe_type);
          hasFields = true;
        }
        if (dto.servings !== undefined) {
          updateQuery += `servings = ?, `;
          updateParams.push(dto.servings);
          hasFields = true;
        }
        if (dto.prep_time !== undefined) {
          updateQuery += `prep_time = ?, `;
          updateParams.push(dto.prep_time);
          hasFields = true;
        }
        if (dto.cook_time !== undefined) {
          updateQuery += `cook_time = ?, `;
          updateParams.push(dto.cook_time);
          hasFields = true;
        }
        if (imageUrls !== undefined) {
          updateQuery += `images = ?, `;
          updateParams.push(JSON.stringify(imageUrls));
          hasFields = true;
        }
        if (videoUrls !== undefined) {
          updateQuery += `videos = ?, `;
          updateParams.push(JSON.stringify(videoUrls));
          hasFields = true;
        }

        if (hasFields) {
          updateQuery = updateQuery.slice(0, -2); // Remove the last comma and space
          updateQuery += ` WHERE recipe_id = ?`;
          updateParams.push(id);
          await queryRunner.manager.query(updateQuery, updateParams);
        }

        // Update instructions: delete existing and insert new ones
        if (dto.instructions !== undefined) {
          this.logger.log(`Updating instructions for recipe ID ${id}: ${JSON.stringify(dto.instructions)}`);
          await queryRunner.manager.query(
            `DELETE FROM Instruction WHERE recipe_id = ?`,
            [id],
          );

          if (dto.instructions && dto.instructions.length > 0) {
            for (const instructionDto of dto.instructions) {
              await queryRunner.manager.query(
                `INSERT INTO Instruction (step_number, description, recipe_id)
                 VALUES (?, ?, ?)`,
                [instructionDto.step_number, instructionDto.description, id],
              );
            }
          }
        }

        // Update ingredients: delete existing and insert new ones
        if (dto.ingredients !== undefined) {
          this.logger.log(`Updating ingredients for recipe ID ${id}: ${JSON.stringify(dto.ingredients)}`);
          await queryRunner.manager.query(
            `DELETE FROM Has WHERE recipe_id_for_ingredient = ?`,
            [id],
          );

          if (dto.ingredients && dto.ingredients.length > 0) {
            for (const ingredientDto of dto.ingredients) {
              await queryRunner.manager.query(
                `INSERT INTO Has (recipe_id_for_ingredient, ingredient_id_for_recipe)
                 VALUES (?, ?)`,
                [id, ingredientDto.ingredient_id],
              );
            }
          }
        }

        // Update categories: delete existing and insert new ones
        if (dto.categories !== undefined) {
          this.logger.log(`Updating categories for recipe ID ${id}: ${JSON.stringify(dto.categories)}`);
          await queryRunner.manager.query(
            `DELETE FROM RecipeCategory WHERE recipe_id_for_category = ?`,
            [id],
          );

          if (dto.categories && dto.categories.length > 0) {
            for (const categoryDto of dto.categories) {
              await queryRunner.manager.query(
                `INSERT INTO RecipeCategory (recipe_id_for_category, category_id_for_recipe)
                 VALUES (?, ?)`,
                [id, categoryDto.category_id],
              );
            }
          }
        }

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }

      const updatedRecipe = await this.getRecipeById(id);
      this.logger.log(`Recipe updated successfully: ${JSON.stringify(updatedRecipe)}`);
      return updatedRecipe;
    } catch (error) {
      this.logger.error(`Failed to update recipe: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to update recipe: ${error.message}`);
    }
  }

  async deleteRecipe(id: number): Promise<void> {
    await this.getRecipeById(id);
    await this.recipeRepository.delete(id);
  }
}