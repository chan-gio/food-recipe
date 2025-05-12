import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, Inject, Query } from '@nestjs/common';
import { IInstructionService } from '../../common/interfaces/instruction.service.interface';
import { Response } from '../../common/types/response.type';
import { Instruction } from '../entities/instruction.entity';
import { CreateInstructionDto } from '../dtos/create-instruction.dto';
import { UpdateInstructionDto } from '../dtos/update-instruction.dto';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Controller('instructions')
export class InstructionController {
  constructor(
    @Inject('IInstructionService')
    private readonly instructionService: IInstructionService) {}
    @Get()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async findAll(@Query() paginationDto: PaginationDto): Promise<Response<Instruction[]>> {
      const { data, total } = await this.instructionService.findAll(paginationDto);
      return {
        data,
        meta: {
          total,
          page: paginationDto.page ?? 1,
          limit: paginationDto.limit ?? 10,
          totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
        },
        message: 'Instructions retrieved successfully',
        code: 200,
      };
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