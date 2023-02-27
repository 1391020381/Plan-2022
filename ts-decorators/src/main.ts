import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { exp2 } from './decorators/exp2';
async function bootstrap() {
  exp2();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
