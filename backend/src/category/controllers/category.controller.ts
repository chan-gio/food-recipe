import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UsePipes, ValidationPipe, UseInterceptors, UploadedFile, Inject, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICategoryService } from '../../common/interfaces/category.service.interface';
import { Response } from '../../common/types/response.type';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { UploadMediaDto } from '../dtos/upload-media.dto';
import { PaginationDto } from 'src/common/dots/pagination.dto';

@Controller('categories')
export class CategoryController {
  constructor(
    @Inject('ICategoryService')
    private readonly categoryService: ICategoryService) {}

    @Get()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async findAll(@Query() paginationDto: PaginationDto): Promise<Response<Category[]>> {
      const { data, total } = await this.categoryService.findAll(paginationDto);
      return {
        data,
        meta: {
          total,
          page: paginationDto.page ?? 1,
          limit: paginationDto.limit ?? 10,
          totalPages: Math.ceil(total / (paginationDto.limit ?? 10)),
        },
        message: 'Categories retrieved successfully',
        code: 200,
      };
    }

  @Get(':id')
  async getCategoryById(@Param('id', ParseIntPipe) id: number): Promise<Response<Category>> {
    const data = await this.categoryService.getCategoryById(id);
    return { data, message: 'Category retrieved successfully', code: 200 };
  }

  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Response<Category[]>> {
    const data = await this.categoryService.findByName(name);
    return { data, message: 'Categories retrieved successfully', code: 200 };
  }

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createCategory(@Body() dto: CreateCategoryDto): Promise<Response<Category>> {
    const data = await this.categoryService.createCategory(dto);
    return { data, message: 'Category created successfully', code: 201 };
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateCategory(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCategoryDto): Promise<Response<Category>> {
    const data = await this.categoryService.updateCategory(id, dto);
    return { data, message: 'Category updated successfully', code: 200 };
  }

  @Delete(':id')
  async deleteCategory(@Param('id', ParseIntPipe) id: number): Promise<Response<null>> {
    await this.categoryService.deleteCategory(id);
    return { data: null, message: 'Category deleted successfully', code: 200 };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async uploadMedia(@UploadedFile() file: Express.Multer.File, @Body() dto: UploadMediaDto): Promise<Response<string>> {
    const data = await this.categoryService.uploadMedia(file, dto);
    return { data, message: 'Media uploaded successfully', code: 200 };
  }
}