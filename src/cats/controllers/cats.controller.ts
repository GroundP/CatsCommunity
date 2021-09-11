import { AmazonS3FileInterceptor } from 'nestjs-multer-extended';
import { multerOptions } from '../../common/utils/multer.options';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/jwt/jwt.guard';
import { LoginRequestDto } from '../../auth/dto/login.request.dto';
import { AuthService } from '../../auth/auth.service';
import { ReadOnlyCatDto } from '../dto/cats.dto';
import { CatRequestDto } from '../dto/cats.request.dto';
import { SuccessInterceptor } from '../../common/interceptors/success.interceptor';
import { CatsService } from '../services/cats.service';
import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  Body,
  UseGuards,
  Req,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { Cat } from '../cats.schema';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
  ) {} // dependency injection(DI)

  // cats/
  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat: Cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    console.log(body);
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  logIn(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogin(data);
  }

  // @ApiOperation({ summary: '로그아웃' }) // 로그아웃은 프론트에서 JWT를 제거하는 것으로 처리
  // @Post('logout')
  // logOut() {
  //   return 'logout';
  // }

  @ApiOperation({ summary: '업로드' })
  //  @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  @UseInterceptors(
    AmazonS3FileInterceptor('image', {
      dynamicPath: 'cats',
    }),
  )
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  uploadCatImg(@UploadedFile() files: any, @CurrentUser() cat: Cat) {
    console.log(files);
    //return { image: files };
    //return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
    //return this.catsService.uploadImg(cat, files);
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}
