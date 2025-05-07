import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instruction } from './entities/instruction.entity';
import { InstructionRepository } from './repositories/instruction.repository';
import { InstructionService } from './services/instruction.service';
import { InstructionController } from './controllers/instruction.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Instruction])],
  providers: [
    { provide: 'IInstructionRepository', useClass: InstructionRepository },
    { provide: 'IInstructionService', useClass: InstructionService },
  ],
  controllers: [InstructionController],
})
export class InstructionModule {}