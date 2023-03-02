import { Injectable } from '@nestjs/common';

@Injectable()
export class OneProvider {
    useClass() {
        return '';
    }

    useFactory() {
        return '构造器提供者1';
    }

    useAsync() {
        return '异步提供者';
    }
}
