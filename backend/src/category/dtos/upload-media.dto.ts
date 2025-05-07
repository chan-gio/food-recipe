import { IsEnum, IsOptional } from 'class-validator';

export enum MediaType {
  IMAGE = 'image',
}

export class UploadMediaDto {
  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  categoryId?: number;
}