import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateIngredientDto {
  @IsString()
  ingredient_name: string;

  @IsOptional()
  @IsString()
  ingredient_type?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  unit?: string;
}