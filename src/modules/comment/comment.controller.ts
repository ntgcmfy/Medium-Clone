import {
  Controller, Post, Get, Put, Delete, Param, Body, UseGuards, Request, HttpCode, HttpStatus
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.CREATED)
    async addComment(
        @Param('slug') slug: string,
        @Body('comment') dto: CreateCommentDto,
        @Request() req: any,
    ) {
        const comment = await this.commentService.addComment(slug, dto, req.user);
        return { comment };
    }
    @Get()
    async getComments(@Param('slug') slug: string) {
        const comments = await this.commentService.getComments(slug);
        return { comments };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @Param('slug') slug: string,
        @Param('id') id: number,
        @Body('comment') updateCommentDto: UpdateCommentDto,
        @Request() req: any,
    ) {
        const comment = await this.commentService.updateComment(slug, id, updateCommentDto, req.user);
        return { comment };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteComment(
        @Param('slug') slug: string,
        @Param('id') id: number,
        @Request() req: any,
    ) {
        await this.commentService.deleteComment(slug, id, req.user);
        return { message: 'Comment deleted successfully' };
    }
}