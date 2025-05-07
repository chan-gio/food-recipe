import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Instruction } from '../entities/instruction.entity';
import { IInstructionRepository } from '../../common/interfaces/instruction.repository.interface';

@Injectable()
export class InstructionRepository implements IInstructionRepository {
  constructor(
    @InjectRepository(Instruction)
    private readonly instructionRepo: Repository<Instruction>,
  ) {}

  async findAll(): Promise<Instruction[]> {
    return this.instructionRepo.find(
      {
        relations: ['recipe'],
      },
    );
  }

  async findById(id: number): Promise<Instruction | null> {
    return this.instructionRepo.findOne({ where: { instruction_id: id }
      , relations: ['recipe'] });
  }

  async create(instruction: Partial<Instruction>): Promise<Instruction> {
    const newInstruction = this.instructionRepo.create(instruction);
    return this.instructionRepo.save(newInstruction);
  }

  async update(id: number, instruction: Partial<Instruction>): Promise<Instruction> {
    await this.instructionRepo.update(id, instruction);
    const updatedInstruction = await this.findById(id);
    if (!updatedInstruction) {
      throw new Error(`Instruction with ID ${id} not found`);
    }
    return updatedInstruction;
  }

  async delete(id: number): Promise<void> {
    await this.instructionRepo.delete(id);
  }
}