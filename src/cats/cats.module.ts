import { ConfigModule } from '@nestjs/config';
import { Comments, CommentsSchema } from './../comments/comments.schema';
import { AuthModule } from './../auth/auth.module';
import { Cat, CatSchema } from './cats.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsService } from './services/cats.service';
import { CatsController } from './controllers/cats.controller';
import { Module, forwardRef } from '@nestjs/common';
import { CatsRepository } from './cats.repository';
import { MulterModule } from '@nestjs/platform-express';
import { MulterExtendedModule } from 'nestjs-multer-extended';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './upload',
    }),
    MulterExtendedModule.register({
      awsConfig: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY,
        region: process.env.AWS_S3_REGION,
      },
      bucket: process.env.AWS_S3_BUCKET_NAME,
      basePath: 'cis', // cats information system
      fileSize: 1 * 1024 * 1024,
    }),
    MongooseModule.forFeature([
      { name: Comments.name, schema: CommentsSchema },
      { name: Cat.name, schema: CatSchema },
    ]),
    forwardRef(() => AuthModule), // 순환 참조를 할 경우 forwardRef
  ],
  controllers: [CatsController],
  providers: [CatsService, CatsRepository],
  exports: [CatsService, CatsRepository],
})
export class CatsModule {}
