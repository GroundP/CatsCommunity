import { ConfigModule } from '@nestjs/config';
import { CatsModule } from './../cats/cats.module';
import { CatsRepository } from './../cats/cats.repository';
import { JwtStrategy } from './jwt/jwt.strategy';
import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }), // 인증에 관한 설정
    // JwtAuthGuard가 Jwtstrategy를 찾을 수 있도록 설정

    JwtModule.register({
      // register는 로그인할 때 쓰임
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1y' },
    }),

    forwardRef(() => CatsModule), // auth서비스에서 CatsRepository에 접근하기 위한 import
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
