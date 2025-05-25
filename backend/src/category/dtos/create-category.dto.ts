import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;
}