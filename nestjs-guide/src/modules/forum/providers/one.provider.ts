import { Injectable } from '@nestjs/common';

@Injectable()
export class OneProvider {
  useClass() {
    return '';
  }
  useFactory() {
    return '构造器提供者';
  }
  useAsync() {
    return '异步提供者';
  }
}
