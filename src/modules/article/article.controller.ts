import {
  Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body('article') dto: CreateArticleDto,
    @Request() req: any,
  ) {
    const article = await this.articleService.create(dto, req.user);
    return { article };
  }

  @Get()
  async findAll() {
    const articles = await this.articleService.findAll();
    return { articles, articlesCount: articles.length };
  }

  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const article = await this.articleService.findBySlug(slug);
    return { article };
  }

  @Put(':slug')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('slug') slug: string,
    @Body('article') dto: UpdateArticleDto,
    @Request() req: any,
  ) {
    const article = await this.articleService.update(slug, dto, req.user.id);
    return { article };
  }

  @Delete(':slug')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('slug') slug: string, @Request() req: any) {
    await this.articleService.remove(slug, req.user.id);
  }
}