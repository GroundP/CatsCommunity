import { CommentsCreateDto } from './../dto/comments.create.dto';
import { CommentsService } from './../services/comments.service';
import { Controller, Get, Post, Param, Body, Patch } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: '모든 고양이 프로필에 적힌 댓글 가져오기' })
  @Get()
  getAllComments() {
    //return 'getAllComments';
    return this.commentsService.getAllComments();
  }

  @ApiOperation({ summary: '특정 고양이 프로필에 댓글 남기기' })
  @Post(':id')
  createComment(@Param('id') id: string, @Body() body: CommentsCreateDto) {
    return this.commentsService.createComment(id, body);
  }

  @ApiOperation({ summary: '좋아요 수 올리기' })
  @Patch(':id')
  plusLike(@Param('id') id: string) {
    return this.commentsService.plusLike(id);
  }
}
