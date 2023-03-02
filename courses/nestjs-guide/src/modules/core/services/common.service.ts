import { Injectable } from '@nestjs/common';

@Injectable()
export class CommonService {
    constructor(private options: { title: string }) {}

    getGlobalValue() {
        return this.options;
    }
}
