import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { ICategoryRepository } from '../../common/interfaces/category.repository.interface';
import { ICategoryService } from '../../common/interfaces/category.service.interface';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dtos/create-category.dto';
import { UpdateCategoryDto } from '../dtos/update-category.dto';
import { UploadMediaDto, MediaType } from '../dtos/upload-media.dto';
import { EntityNotFoundException } from '../../common/exceptions/not-found.exception';

@Injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @Inject('ICategoryRepository')
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
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

  async uploadMedia(file: Express.Multer.File, dto: UploadMediaDto): Promise<string> {
    const { type, categoryId } = dto;

    // Upload file to Cloudinary
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: type === MediaType.IMAGE ? 'image' : 'auto',
          folder: `categories/${categoryId || 'temp'}`,
          chunk_size: 6000000,
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        },
      );
      require('fs').createReadStream(file.path).pipe(uploadStream);
    });

    const mediaUrl = uploadResult.secure_url;

    // If categoryId is provided, update the category
    if (categoryId) {
      const category = await this.getCategoryById(categoryId);
      category.images = [...(category.images || []), mediaUrl];
      await this.categoryRepository.update(categoryId, category);
    }

    return mediaUrl;
  }
}