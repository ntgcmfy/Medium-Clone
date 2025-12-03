import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Article } from './entities/article.entity';
import { Tag } from './entities/tag.entity';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Article, Tag])],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}