import { CatsRepository } from './../../cats/cats.repository';
import { Payload } from './jwt.payload';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly catsRepository: CatsRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // 추후 환경변수로 옮겨야 함
      ignoreExpiration: false, // 만료기간 설정
    });
  }

  async validate(payload: Payload) {
    // 프론트에서 JWT가 날라왔을 때 해당하는 것을 읽고 거기서 payload를 뽑아냈다면
    // payload에 대해서 유효성 검사를 해야 한다.
    const cat = await this.catsRepository.findCatByIdWithoutPW(payload.sub);
    // sub는 cat.id(JWT만들어서 보낼때 sub:cat.id로 설정했었다.)

    if (cat) {
      return cat; // request.user에 cat이 들어감
    } else {
      throw new UnauthorizedException('사용자 정보를 찾을 수 없습니다.');
    }
  } // 인증 부분
}
