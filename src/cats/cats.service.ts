import { CatRequestDto } from './dto/cats.request.dto';
import {
  Injectable,
  HttpException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CatsRepository } from './cats.repository';

@Injectable()
export class CatsService {
  constructor(private readonly catsRepository: CatsRepository) {}

  async signUp(body: CatRequestDto) {
    const { email, name, password } = body;

    // 유효성 검사
    const isCatExist = await this.catsRepository.existsEmail(email);
    if (isCatExist) {
      throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.'); // 아랫줄과 같음
      //throw new HttpException("해당하는 고양이는 이미 존재합니다.", 403);
    }

    // pw 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // db insert
    const cat = await this.catsRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return cat.readOnlyData;
  }
}
