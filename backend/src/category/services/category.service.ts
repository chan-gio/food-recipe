import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ICategoryRepository } from '../../common/interfaces/category.repository.interface';
import { ICategoryService } from '../../common/interfaces/category.service.interface';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Category[]; total: number }> {
    return this.categoryRepository.findAll(paginationDto);
  }

  async getCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new EntityNotFoundException('Category', id);
    }
    return category;
  }

  async findByName(name: string): Promise<Category[]> {
    return this.categoryRepository.findByName(name);
  }

  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    return this.categoryRepository.create(dto);
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    await this.getCategoryById(id);
    return this.categoryRepository.update(id, dto);
  }

  async deleteCategory(id: number): Promise<void> {
    await this.getCategoryById(id);
    await this.categoryRepository.delete(id);
  }

}