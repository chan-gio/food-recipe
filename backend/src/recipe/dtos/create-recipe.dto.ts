import { IsString, IsOptional, IsInt, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRecipeDto {
  @IsString()
  recipe_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  recipe_type?: string;

  @IsOptional()
  @IsInt()
  servings?: number;

  @IsOptional()
  @IsInt()
  prep_time?: number;

  @IsOptional()
  @IsInt()
  cook_time?: number;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  videos?: string[];

  @IsInt()
  user_id: number; 
}