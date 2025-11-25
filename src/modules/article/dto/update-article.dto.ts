import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateArticleDto {
  @IsString({ message: 'Title must be a string' })
  @IsOptional()
  title?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Body must be a string' })
  @IsOptional()
  body?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  tagList?: string[];
}