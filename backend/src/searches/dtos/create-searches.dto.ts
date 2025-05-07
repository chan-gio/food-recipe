import { IsInt, IsString, IsOptional } from 'class-validator';

export class CreateSearchesDto {
  @IsInt()
  user_id: number;

  @IsInt()
  recipe_id: number;

  @IsOptional()
  @IsString()
  search_query?: string;
}