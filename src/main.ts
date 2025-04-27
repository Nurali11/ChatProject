import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Укажи порт фронтенда (если Vite)
    credentials: true, // если нужно передавать куки, авторизации и т.д.
  });
  
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // чтобы доступ был через URL
  });

  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <--- ВАЖНО!
  }));

  await app.listen(3000);
}
bootstrap();
