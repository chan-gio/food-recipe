import { IsInt, IsNotEmpty } from 'class-validator';

export class CategoryDto {
  @IsInt()
  @IsNotEmpty()
  category_id: number;
}