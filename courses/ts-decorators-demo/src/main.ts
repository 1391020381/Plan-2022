import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
// import { exp1 } from './decorators/exp1';
// import { exp2 } from './decorators';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: false });
    await app.listen(3000);
    // exp1();
    // exp2();
}
bootstrap();
