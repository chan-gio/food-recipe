import { IsInt, IsString, Min } from 'class-validator';

export class CreateInstructionDto {
  @IsInt()
  recipe_id: number;

  @IsInt()
  @Min(1)
  step_number: number;

  @IsString()
  description: string;
}