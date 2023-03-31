import { ArgumentMetadata } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { AppPipe } from './app.pipe';

/**
 * Wesockets验证管道
 */
export class WsPipe extends AppPipe {
    async transform(value: any, metadata: ArgumentMetadata) {
        try {
            return await super.transform(value, metadata);
        } catch (err: any) {
            const error = err.response ?? err;
            throw new WsException(error);
        }
    }
}
