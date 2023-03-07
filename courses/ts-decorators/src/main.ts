import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { exp16 } from './decorators/exp16';
// import { exp15 } from './decorators/exp15';
// import { exp14 } from './decorators/exp14';
// import { exp13 } from './decorators/exp13';
// import { exp1 } from './decorators/exp1';
// import { exp12 } from './decorators/exp12';
// import { exp910 } from './decorators/exp9-10';

async function bootstrap() {
    // exp1();
    // exp2();
    // exp3();
    // exp4();
    // exp5();
    // exp6();
    // exp910();
    // exp910();
    // exp11();
    // exp12();
    // exp13();
    // exp14();
    // exp15();
    exp16();
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(3000);
}
bootstrap();
