import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../../common/interfaces/category.repository.interface';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  private readonly logger = new Logger(CategoryRepository.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(paginationDto: PaginationDto): Promise<{ data: Category[]; total: number }> {
    try {
      const { page, limit } = paginationDto;
      const skip = ((page ?? 1) - 1) * (limit ?? 10);
      const [data, total] = await this.categoryRepo.findAndCount({
        skip,
        take: limit,
        relations: ['recipes'],
      });
  
      // Thêm số lượng công thức (recipeCount) vào mỗi danh mục
      const dataWithRecipeCount = data.map(category => ({
        ...category,
        recipeCount: category.recipes ? category.recipes.length : 0, // Tính số lượng công thức
      }));
  
      this.logger.log(`Fetched ${dataWithRecipeCount.length} categories (page ${page}, limit ${limit})`);
      return { data: dataWithRecipeCount, total };
    } catch (error) {
      this.logger.error(`Failed to fetch all categories: ${error.message}`, error.stack);
      throw error;
    }
  }
  
  async findById(id: number): Promise<Category | null> {
    try {
      return await this.categoryRepo.findOne({ where: { category_id: id }, relations: ['recipes'] });
    } catch (error) {
      this.logger.error(`Failed to fetch category with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findByName(name: string): Promise<Category[]> {
    try {
      const categories = await this.categoryRepo.find({
        where: { category_name: Like(`%${name}%`) },
      });
      this.logger.log(`Fetched categories with name '${name}': ${JSON.stringify(categories)}`);
      return categories;
    } catch (error) {
      this.logger.error(`Failed to fetch categories with name '${name}': ${error.message}`, error.stack);
      throw error;
    }
  }

  async create(category: Partial<Category>): Promise<Category> {
    try {
      const newCategory = this.categoryRepo.create(category);
      return await this.categoryRepo.save(newCategory);
    } catch (error) {
      this.logger.error(`Failed to create category: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: number, category: Partial<Category>): Promise<Category> {
    try {
      await this.categoryRepo.update(id, category);
      const updatedCategory = await this.findById(id);
      if (!updatedCategory) {
        throw new Error(`Category with ID ${id} not found`);
      }
      return updatedCategory;
    } catch (error) {
      this.logger.error(`Failed to update category with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const result = await this.categoryRepo.delete(id);
      if (result.affected === 0) {
        throw new Error(`Category with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete category with ID ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }
}