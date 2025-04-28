import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

export function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}

export function addMiddleware(app: INestApplication) {
  app.useLogger(app.get(Logger));
  app.use(compression());
  app.use(helmet());

  app.setGlobalPrefix('/api');
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
  });
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerErrorInterceptor(),
  );
}
