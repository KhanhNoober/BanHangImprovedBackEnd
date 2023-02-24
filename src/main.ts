import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join('src', 'public'), {
    index: false,
    prefix: '/static/',
  });

  app.enableCors();
  await app.listen(3000);
}
bootstrap();
