import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from '../user/entities/user.entity';
import { Article } from '../article/entities/article.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

    async addComment( slug: string, createCommentDto: CreateCommentDto, user: User) {
        const article = await this.articleRepository.findOne({ where: { slug } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        const comment = this.commentRepository.create({
        ...createCommentDto,
        article,
        author: user,
        });
        await this.commentRepository.save(comment);
        return comment;
    }

    async getComments(slug: string) {
        const article = await this.articleRepository.findOne({ where: { slug } });
        if (!article){
            throw new NotFoundException('Article not found');
        } 
        return this.commentRepository.find({ where: { article: { id: article.id } }, order: { createdAt: 'ASC' } });
    }

    async updateComment(slug: string, commentId: number, updateCommentDto: UpdateCommentDto, user: User) {
        const article = await this.articleRepository.findOne({ where: { slug } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        const comment = await this.commentRepository.findOne({ where: { id: commentId, article: { id: article.id } } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.author.id !== user.id) {
            throw new ForbiddenException('You are not authorized to update this comment');
        }
        Object.assign(comment, updateCommentDto);
        await this.commentRepository.save(comment);
        return comment;
    }

    async deleteComment(slug: string, commentId: number, user: User) {
        const article = await this.articleRepository.findOne({ where: { slug } });
        if (!article) {
            throw new NotFoundException('Article not found');
        }
        const comment = await this.commentRepository.findOne({ where: { id: commentId, article: { id: article.id } } });
        if (!comment) {
            throw new NotFoundException('Comment not found');
        }
        if (comment.author.id !== user.id) {
            throw new ForbiddenException('You are not authorized to delete this comment');
        }
        await this.commentRepository.remove(comment);
        return { message: 'Comment deleted successfully' };
    }   
}