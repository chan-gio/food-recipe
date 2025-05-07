import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeRepository } from './repositories/recipe.repository';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  controllers: [RecipeController],
  providers: [RecipeService, RecipeRepository],
})
export class RecipeModule {}
