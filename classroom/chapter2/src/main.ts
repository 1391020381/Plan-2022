import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
        { logger: ['warn'] },
    );
    app.setGlobalPrefix('api');
    app.enableCors();
    await app.listen(3100, '0.0.0.0');
}
bootstrap();
