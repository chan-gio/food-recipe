import { IsString, IsNotEmpty, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDto } from './ingredient.dto';
import { CategoryDto } from './category.dto';
import { InstructionDto } from './instruction.dto';

export class CreateRecipeDto {
  @IsString()
  @IsNotEmpty()
  recipe_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  recipe_type: string;

  @IsInt()
  @IsNotEmpty()
  servings: number;

  @IsInt()
  @IsNotEmpty()
  prep_time: number;

  @IsInt()
  @IsNotEmpty()
  cook_time: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos: string[];

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @IsOptional()
  categories: CategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  @IsOptional()
  instructions: InstructionDto[];
}