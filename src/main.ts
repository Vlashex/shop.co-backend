import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });
  app.setGlobalPrefix('api');

  app.use(bodyParser.json({limit: '5mb'}))
  app.use(bodyParser.urlencoded({limit: '5mb'}))

  await app.listen(4200);
}
bootstrap();
