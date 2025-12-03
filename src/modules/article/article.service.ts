import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { User } from '../user/entities/user.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(createDto: CreateArticleDto, author: User) {
    let tags: Tag[] = [];
    if (createDto.tagList) {
      tags = await Promise.all(createDto.tagList.map(async name => {
        let tag = await this.tagRepo.findOne({ where: { name } });
        if (!tag) tag = await this.tagRepo.save(this.tagRepo.create({ name }));
        return tag;
      }));
    }
    const article = this.articleRepo.create({ ...createDto, author, tags });
    await this.articleRepo.save(article);
    return article;
  }

  async findAll(): Promise<Article[]> {
    return this.articleRepo.find();
  }

  async findBySlug(slug: string): Promise<Article> {
    const article = await this.articleRepo.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  async update(slug: string, dto: UpdateArticleDto, userId: number) {
    const article = await this.findBySlug(slug);
    if (article.author.id !== userId) throw new ForbiddenException('Not your article');
    Object.assign(article, dto);
    if (dto.tagList) {
      article.tags = await Promise.all(dto.tagList.map(async name => {
        let tag = await this.tagRepo.findOne({ where: { name } });
        if (!tag) tag = await this.tagRepo.save(this.tagRepo.create({ name }));
        return tag;
      }));
    }
    await this.articleRepo.save(article);
    return article;
  }

  async remove(slug: string, userId: number) {
    const article = await this.findBySlug(slug);
    if (article.author.id !== userId) throw new ForbiddenException('Not your article');
    await this.articleRepo.remove(article);
  }
}