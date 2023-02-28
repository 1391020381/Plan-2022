import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { exp1 } from './decorators/exp1';
import { exp2, exp3, exp4 } from './decorators/exp2';
import { exp5 } from './decorators/exp5';
import { exp6 } from './decorators/exp6';
import { exp7 } from './decorators/exp7';
import { exp8 } from './decorators/exp8';
async function bootstrap() {
  //exp1();
  // exp2();
  // exp3();
  // exp4();
  // exp5();
  // exp6();
  // exp7();
  exp8();
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
