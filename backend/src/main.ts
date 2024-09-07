import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { patchNestJsSwagger } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('집현전 백엔드 6차')
    .setDescription('집현전 백엔드 6차 API 명세')
    .setVersion('0.0.1')
    .setExternalDoc('JSON 명세', 'json')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api/json',
  });

  await app.listen(3000);
}

patchNestJsSwagger();
bootstrap();
