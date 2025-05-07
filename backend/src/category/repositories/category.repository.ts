import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../../common/interfaces/category.repository.interface';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findById(id: number): Promise<Category | null> {
    return this.categoryRepo.findOne({ where: { category_id: id } });
  }

  async create(category: Partial<Category>): Promise<Category> {
    const newCategory = this.categoryRepo.create(category);
    return this.categoryRepo.save(newCategory);
  }

  async update(id: number, category: Partial<Category>): Promise<Category> {
    await this.categoryRepo.update(id, category);
    const updatedCategory = await this.findById(id);
    if (!updatedCategory) {
      throw new Error(`Category with id ${id} not found`);
    }
    return updatedCategory;
  }

  async delete(id: number): Promise<void> {
    await this.categoryRepo.delete(id);
  }
}