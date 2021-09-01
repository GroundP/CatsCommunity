import { Injectable, PipeTransform, HttpException } from '@nestjs/common';

@Injectable()
export class PositiveIntPipe implements PipeTransform {
  transform(value: number) {
    console.log(value);
    if (value < 0) {
      // throw new HttpException('value > 0', 400);
      return value * -1;
    }
    return value;
  }
}
