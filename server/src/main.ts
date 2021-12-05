import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import * as mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { JsonRpcWsAdapter } from './adapters/json-rpc-ws-adapter';

require('dotenv').config();
async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URL as string);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ credentials: true, origin: true });
  app.useWebSocketAdapter(new JsonRpcWsAdapter(app));
  app.use(cookieParser());
  app.useStaticAssets(
    join(__dirname, '..', '..', '..', '..', 'media-server/server/thumbnails'),
    { prefix: '/thumbnails/' },
  );
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 8080);
}
bootstrap();
