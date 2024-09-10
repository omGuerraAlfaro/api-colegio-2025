import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from 'filters/all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Pipes y filtros globales
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  app.enableCors({
    origin: [
      'https://www.colegioandeschile.cl',
      'https://colegioandeschile.cl',
      'www.colegioandeschile.cl',
      'https://www.intranet.colegioandeschile.cl',
      'https://intranet.colegioandeschile.cl',
      'http://localhost',
      'http://localhost:8200',
      'http://localhost:8100',
      'http://localhost:4200',
      'http://localhost:8101',
      '*'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Content-Type',
      'Tbk-Api-Key-Id',
      'Tbk-Api-Key-Secret',
    ],
    credentials: false,
  });

  const config = new DocumentBuilder()
    .setTitle('API COLEGIO')
    .setDescription('ENDPOINTS COLEGIO')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3200);
}

bootstrap();
