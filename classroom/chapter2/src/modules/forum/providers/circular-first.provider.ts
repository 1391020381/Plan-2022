import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { CircularSecondProvider } from './circular-second.provider';

@Injectable()
export class CircularFirstProvider {
    constructor(
        @Inject(forwardRef(() => CircularSecondProvider))
        protected second: CircularSecondProvider,
    ) {}

    first() {
        return `循环依赖1${this.second.second()}`;
    }
}
