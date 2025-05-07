import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateIngredientDto {
    @IsNotEmpty()
    @IsString()
    ingredient_name: string;

    @IsOptional()
    @IsString()
    ingredient_type?: string;

    @IsOptional()
    @IsString()
    ing_amount?: string;
}

export class UpdateIngredientDto {
    @IsOptional()
    @IsString()
    ingredient_name?: string;

    @IsOptional()
    @IsString()
    ingredient_type?: string;

    @IsOptional()
    @IsString()
    ing_amount?: string;
}