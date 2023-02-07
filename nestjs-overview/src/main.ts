import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {VersioningType,VERSION_NEUTRAL} from '@nestjs/common'
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({
    type:VersioningType.URI,
     defaultVersion:['1','2']
    //defaultVersion:VERSION_NEUTRAL
  })
  await app.listen(3000);
}
bootstrap();
