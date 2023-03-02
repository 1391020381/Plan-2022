import { Injectable } from '@nestjs/common';

@Injectable()
export class ExampleProvider {
    useValue() {
        return '';
    }

    useId() {
        return '字符串提供者';
    }

    useAlias() {
        return '别名提供者';
    }
}
