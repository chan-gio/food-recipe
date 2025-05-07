import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  category_name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}