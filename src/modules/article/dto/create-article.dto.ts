import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateArticleDto {
  @IsString({ message: 'Title must be a string' })
  @IsNotEmpty()
  title: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty()
  description: string;

  @IsString({ message: 'Body must be a string' })
  @IsNotEmpty()
  body: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true, message: 'Each tag must be a string' })
  tagList?: string[];
}