import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryRepository)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async findById(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { category_id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    return category;
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(dto);
    return this.categoryRepository.save(newCategory);
  }

  async updateCategory(categoryId: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findById(categoryId);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async deleteCategory(categoryId: number): Promise<void> {
    const result = await this.categoryRepository.delete(categoryId);
    if (result.affected === 0) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
  }
}
