import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Category> {
    const category = await this.categoryService.findById(id);
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  @Post()
  async create(@Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoryService.createCategory(categoryData);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() categoryData: Partial<Category>): Promise<Category> {
    return this.categoryService.updateCategory(id, categoryData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    await this.categoryService.deleteCategory(id);
  }
}