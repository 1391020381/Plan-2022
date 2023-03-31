import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CircularFirstProvider } from './circular-first.provider';

@Injectable()
export class CircularSecondProvider {
    constructor(
        @Inject(forwardRef(() => CircularFirstProvider))
        protected first: CircularFirstProvider,
    ) {}

    second() {
        return `循环依赖2`;
    }
}
