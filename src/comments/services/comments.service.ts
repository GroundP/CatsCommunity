import { CatsRepository } from './../../cats/cats.repository';
import { Comments } from './../comments.schema';
import { CommentsCreateDto } from './../dto/comments.create.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comments.name) private readonly commentsModel: Model<Comments>,
    private readonly catsRepository: CatsRepository,
  ) {}

  async getAllComments() {
    try {
      const comments = await this.commentsModel.find();
      return comments;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async createComment(id: string, commentData: CommentsCreateDto) {
    try {
      const targetCat = await this.catsRepository.findCatByIdWithoutPW(id);
      const { contents, author } = commentData; // 구조분해 할당
      const validateAuthor = await this.catsRepository.findCatByIdWithoutPW(
        author,
      ); // 작성자의 validation을 위함(validateAuthor)
      const newComment = new this.commentsModel({
        author: validateAuthor._id,
        contents,
        info: targetCat._id,
      });
      return await newComment.save(); // db에 저장(newComment의 형태로)
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async plusLike(id: string) {
    try {
      const comment = await this.commentsModel.findById(id);
      comment.likeCount += 1;
      return await comment.save(); // id로 db값 읽어서 +1하고 다시 저장
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
