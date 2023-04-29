import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // - use dtos to make data validation
  // - pass only used fields, removing all fields not present in the dto
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3333);
}
bootstrap();
