import { ApiProperty } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsPositive, IsString } from 'class-validator';
import { Document, SchemaOptions, Types } from 'mongoose';

const options: SchemaOptions = {
  timestamps: true,
};

@Schema(options)
export class Comments extends Document {
  @ApiProperty({
    description: '작성한 고양이 id',
    required: true,
  })
  @Prop({
    types: Types.ObjectId, // id의 타입은 Types.ObjectId(몽구스에서 string으로 자동변환 했을 뿐..)
    required: true,
    ref: 'cats', // 참조하려는 도큐먼트 스키마 이름은 Cat이지만 자동 변환에 의해 소문자에 s를 더한 이름으로 된다.
  })
  @IsNotEmpty()
  author: string; // 댓글 단 고양이 이름

  @ApiProperty({
    description: '댓글 컨텐츠',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string; // 댓글 내용

  @ApiProperty({
    description: '좋아요 수',
  })
  @Prop({
    default: 0,
  })
  @IsPositive()
  likeCount: number;

  @ApiProperty({
    description: '작성 대상 (게시물, 정보글)',
    required: true,
  })
  @Prop({
    types: Types.ObjectId,
    required: true,
    ref: 'cats',
  })
  @IsNotEmpty()
  info: Types.ObjectId; // 작성 대상의 id
}

export const CommentsSchema = SchemaFactory.createForClass(Comments);
