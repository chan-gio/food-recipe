import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './entities/ingredient.entity';
import { IngredientRepository } from './repositories/ingredient.repository';
import { IngredientService } from './services/ingredient.service';
import { IngredientController } from './controllers/ingredient.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient])],
  providers: [
    { provide: 'IIngredientRepository', useClass: IngredientRepository },
    { provide: 'IIngredientService', useClass: IngredientService },
  ],
  controllers: [IngredientController],
})
export class IngredientModule {}