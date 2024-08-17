import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'fatal', 'log'],
  });
  app.enableCors();
  await app.listen(5000);
}
bootstrap();
