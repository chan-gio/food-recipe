import { Inject, Injectable } from '@nestjs/common';
import { IInstructionRepository } from '../../common/interfaces/instruction.repository.interface';
import { IInstructionService } from '../../common/interfaces/instruction.service.interface';
import { Instruction } from '../entities/instruction.entity';
import { CreateInstructionDto } from '../dtos/create-instruction.dto';
import { UpdateInstructionDto } from '../dtos/update-instruction.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class InstructionService implements IInstructionService {
  constructor(
    @Inject('IInstructionRepository')
    private readonly instructionRepository: IInstructionRepository) {}

    async findAll(paginationDto: PaginationDto): Promise<{ data: Instruction[]; total: number }> {
      return this.instructionRepository.findAll(paginationDto);
    }

  async getInstructionById(id: number): Promise<Instruction> {
    const instruction = await this.instructionRepository.findById(id);
    if (!instruction) {
      throw new EntityNotFoundException('Instruction', id);
    }
    return instruction;
  }

  async createInstruction(dto: CreateInstructionDto): Promise<Instruction> {
    return this.instructionRepository.create(dto);
  }

  async updateInstruction(id: number, dto: UpdateInstructionDto): Promise<Instruction> {
    await this.getInstructionById(id);
    return this.instructionRepository.update(id, dto);
  }

  async deleteInstruction(id: number): Promise<void> {
    await this.getInstructionById(id);
    await this.instructionRepository.delete(id);
  }
}