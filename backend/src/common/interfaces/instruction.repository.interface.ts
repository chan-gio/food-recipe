import { Instruction } from '../../instruction/entities/instruction.entity';
import { PaginationDto } from '../dots/pagination.dto';

export interface IInstructionRepository {
  findAll(paginationDto: PaginationDto): Promise< {data: Instruction[]; total: number }>;
  findById(id: number): Promise<Instruction | null>;
  create(instruction: Partial<Instruction>): Promise<Instruction>;
  update(id: number, instruction: Partial<Instruction>): Promise<Instruction>;
  delete(id: number): Promise<void>;
}