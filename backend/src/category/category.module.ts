import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { CloudinaryProvider } from '../common/config/cloudinary.config';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [
    { provide: 'ICategoryRepository', useClass: CategoryRepository },
    { provide: 'ICategoryService', useClass: CategoryService },
    CloudinaryProvider,
  ],
  controllers: [CategoryController],
})
export class CategoryModule {}