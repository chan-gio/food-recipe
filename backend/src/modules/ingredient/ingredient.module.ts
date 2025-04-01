import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { IngredientRepository } from './repositories/ingredient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [IngredientService, IngredientRepository],
  controllers: [IngredientController],
})
export class IngredientModule {}
