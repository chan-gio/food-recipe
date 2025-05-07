import { IsEnum, IsOptional } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

export class UploadMediaDto {
  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  recipeId?: number;
}