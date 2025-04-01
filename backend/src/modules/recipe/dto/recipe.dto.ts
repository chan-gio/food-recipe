import { IsString, IsInt, IsOptional } from 'class-validator';

export class CreateRecipeDto {
  @IsString()
  recipe_name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  recipe_type: string;

  @IsInt()
  quantity: number;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  recipe_name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  recipe_type?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;
}
