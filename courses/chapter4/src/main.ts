import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

import { typeormDemo } from './typeorm-quick-start';

async function bootstrap() {
    typeormDemo();
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    // 允许跨域
    app.enableCors();
    await app.listen(3000);
}
bootstrap();
