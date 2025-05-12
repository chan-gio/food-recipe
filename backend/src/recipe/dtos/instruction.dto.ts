import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class InstructionDto {
  @IsInt()
  @IsNotEmpty()
  step_number: number;

  @IsString()
  @IsNotEmpty()
  description: string;
}