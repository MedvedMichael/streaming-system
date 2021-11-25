import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

import * as mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

require('dotenv').config();
async function bootstrap() {
  await mongoose.connect(process.env.MONGODB_URL as string);
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors({ credentials: true, origin: true });
  app.use(cookieParser());
  await app.listen(process.env.SERVER_PORT || 8080);
}
bootstrap();
