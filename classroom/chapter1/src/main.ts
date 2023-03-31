import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { exp910 } from './decorators/exp9-10';

async function bootstrap() {
    // exp1();
    // exp2();
    // exp3();
    // exp4();
    // exp5();
    // exp6();
    exp910();
    // exp910();
    // exp11();
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(3000);
}
bootstrap();
