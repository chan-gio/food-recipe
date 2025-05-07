import { Category } from '../../category/entities/category.entity';
import { CreateCategoryDto } from '../../category/dtos/create-category.dto';
import { UpdateCategoryDto } from '../../category/dtos/update-category.dto';
import { UploadMediaDto } from '../../category/dtos/upload-media.dto';

export interface ICategoryService {
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category>;
  createCategory(dto: CreateCategoryDto): Promise<Category>;
  updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category>;
  deleteCategory(id: number): Promise<void>;
  uploadMedia(file: Express.Multer.File, dto: UploadMediaDto): Promise<string>;
}