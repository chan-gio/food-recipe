import { Transform, Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, Min } from 'class-validator';

export class FilterRecipeDto {
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) => {
    console.log('Transforming categoryIds - Raw value:', value);
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      const result = isNaN(parsed) ? undefined : [parsed];
      console.log('Transforming categoryIds - Result:', result);
      return result;
    }
    if (Array.isArray(value)) {
      const parsedArray = value.map(item => parseInt(item, 10)).filter(num => !isNaN(num));
      const result = parsedArray.length > 0 ? parsedArray : undefined;
      console.log('Transforming categoryIds - Result:', result);
      return result;
    }
    console.log('Transforming categoryIds - Result: undefined');
    return undefined;
  })
  @Type(() => Number)
  categoryIds?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(1, { each: true })
  @Transform(({ value }) => {
    console.log('Transforming ingredientIds - Raw value:', value);
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      const result = isNaN(parsed) ? undefined : [parsed];
      console.log('Transforming ingredientIds - Result:', result);
      return result;
    }
    if (Array.isArray(value)) {
      const parsedArray = value.map(item => parseInt(item, 10)).filter(num => !isNaN(num));
      const result = parsedArray.length > 0 ? parsedArray : undefined;
      console.log('Transforming ingredientIds - Result:', result);
      return result;
    }
    console.log('Transforming ingredientIds - Result: undefined');
    return undefined;
  })
  @Type(() => Number)
  ingredientIds?: number[];
}