import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addSwagger, addMiddleware } from './appMiddleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  addMiddleware(app);
  addSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
