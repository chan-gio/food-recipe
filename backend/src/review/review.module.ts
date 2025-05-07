import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './services/review.service';
import { ReviewController } from './controllers/review.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { UserModule } from '../user/user.module';
import { Recipe } from '../recipe/entities/recipe.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, Recipe, User]),
    RecipeModule,
    UserModule,
  ],
  providers: [
    { provide: 'IReviewRepository', useClass: ReviewRepository },
    { provide: 'IReviewService', useClass: ReviewService },
  ],
  controllers: [ReviewController],
})
export class ReviewModule {}