import { Instruction } from '../../instruction/entities/instruction.entity';
import { CreateInstructionDto } from '../../instruction/dtos/create-instruction.dto';
import { UpdateInstructionDto } from '../../instruction/dtos/update-instruction.dto';

export interface IInstructionService {
  getAllInstructions(): Promise<Instruction[]>;
  getInstructionById(id: number): Promise<Instruction>;
  createInstruction(dto: CreateInstructionDto): Promise<Instruction>;
  updateInstruction(id: number, dto: UpdateInstructionDto): Promise<Instruction>;
  deleteInstruction(id: number): Promise<void>;
}