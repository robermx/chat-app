import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // Enable cors for React
    origin: ['http://localhost:3000'],
  });
  await app.listen(8000);
}
bootstrap();
