import { IsInt, IsString, IsOptional, Min, Max, ValidateIf } from 'class-validator';

export class CreateReviewDto {
  @IsInt()
  recipe_id: number;

  @IsInt()
  user_id: number;

  @ValidateIf(o => !o.parent_review_id) 
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsInt()
  parent_review_id?: number;
}