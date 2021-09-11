import { CommentsSchema } from './../comments/comments.schema';
import { CatRequestDto } from './dto/cats.request.dto';
import { Cat } from './cats.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Model, Types } from 'mongoose';
@Injectable()
export class CatsRepository {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async existsEmail(email: string): Promise<boolean> {
    return await this.catModel.exists({ email });
  }

  async create(cat: CatRequestDto): Promise<Cat> {
    return await this.catModel.create(cat);
  }

  async findCatByEmail(email: string): Promise<Cat | null> {
    const cat = await this.catModel.findOne({ email });
    return cat;
  }

  async findCatByIdWithoutPW(id: string | Types.ObjectId): Promise<Cat | null> {
    const cat = await this.catModel.findById(id).select('-password');
    return cat;
  }

  async findByIdAndUpdateImg(id: string, fileName: string) {
    const cat = await this.catModel.findById(id);
    cat.imgUrl = `http://localhost:8000/media/${fileName}`;
    const newCat = await cat.save(); // 업데이트 된것 저장
    console.log(newCat);
    return newCat.readOnlyData;
  }

  async findAll() {
    const CommentModel = mongoose.model('comments', CommentsSchema); //comments는 스키마 이름

    const result = await this.catModel
      .find()
      .populate('comments', CommentModel); // comments는 virtual field

    return result;
    //return await this.catModel.find(); // 인자 없이 find를 쓰면 db의 모든 데이터 가져옴
  }
}
