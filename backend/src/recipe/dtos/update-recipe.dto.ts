import { IsString, IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IngredientDto } from './ingredient.dto';
import { CategoryDto } from './category.dto';
import { InstructionDto } from './instruction.dto';

export class UpdateRecipeDto {
  @IsString()
  @IsOptional()
  recipe_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  recipe_type?: string;

  @IsInt()
  @IsOptional()
  servings?: number;

  @IsInt()
  @IsOptional()
  prep_time?: number;

  @IsInt()
  @IsOptional()
  cook_time?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  videos?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => IngredientDto)
  @IsOptional()
  ingredients?: IngredientDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryDto)
  @IsOptional()
  categories?: CategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InstructionDto)
  @IsOptional()
  instructions?: InstructionDto[];
}