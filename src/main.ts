import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder } from 'node_modules/@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from 'node_modules/@nestjs/swagger/dist/swagger-module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Rekam Medis API')
    .setDescription('API untuk mengelola data rekam medis pasien')
    .setVersion('1.0')
    .addTag('patients', 'Endpoints untuk mengelola data pasien')
    .addTag('medical-records', 'Endpoints untuk mengelola data rekam medis')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
