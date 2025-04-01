import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  category_name?: string | undefined;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  category_name?: string | undefined;
}