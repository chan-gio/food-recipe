import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './entities/recipe.entity';
import { RecipeRepository } from './repositories/recipe.repository';
import { RecipeService } from './services/recipe.service';
import { RecipeController } from './controllers/recipe.controller';
import { CloudinaryProvider } from '../common/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe])],
  providers: [
    {
      provide: 'IRecipeRepository',
      useClass: RecipeRepository,
    },
    {
      provide: 'IRecipeService',
      useClass: RecipeService,
    },
    CloudinaryProvider,
  ],
  controllers: [RecipeController],
  exports: [TypeOrmModule],
})
export class RecipeModule {}