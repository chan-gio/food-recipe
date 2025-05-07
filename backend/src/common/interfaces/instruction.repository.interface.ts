import { Instruction } from '../../instruction/entities/instruction.entity';

export interface IInstructionRepository {
  findAll(): Promise<Instruction[]>;
  findById(id: number): Promise<Instruction | null>;
  create(instruction: Partial<Instruction>): Promise<Instruction>;
  update(id: number, instruction: Partial<Instruction>): Promise<Instruction>;
  delete(id: number): Promise<void>;
}