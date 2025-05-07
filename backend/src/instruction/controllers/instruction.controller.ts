import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject } from '@nestjs/common';
import { IInstructionService } from '../../common/interfaces/instruction.service.interface';
import { Response } from '../../common/types/response.type';
import { Instruction } from '../entities/instruction.entity';
import { CreateInstructionDto } from '../dtos/create-instruction.dto';
import { UpdateInstructionDto } from '../dtos/update-instruction.dto';

@Controller('instructions')
export class InstructionController {
  constructor(
    @Inject('IInstructionService')
    private readonly instructionService: IInstructionService) {}

  @Get()
  async getAllInstructions(): Promise<Response<Instruction[]>> {
    const data = await this.instructionService.getAllInstructions();
    return { data, message: 'Instructions retrieved successfully', code: 200 };
  }

  @Get(':id')
  async getInstructionById(@Param('id', ParseIntPipe) id: number): Promise<Response<Instruction>> {
    const data = await this.instructionService.getInstructionById(id);
    return { data, message: 'Instruction retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createInstruction(@Body() dto: CreateInstructionDto): Promise<Response<Instruction>> {
    const data = await this.instructionService.createInstruction(dto);
    return { data, message: 'Instruction created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateInstruction(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInstructionDto): Promise<Response<Instruction>> {
    const data = await this.instructionService.updateInstruction(id, dto);
    return { data, message: 'Instruction updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteInstruction(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.instructionService.deleteInstruction(id);
    return { data: null, message: 'Instruction deleted successfully', code: 200 };
  }
}