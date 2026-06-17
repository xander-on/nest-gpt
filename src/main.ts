import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './gpt/Filters/allExceptions.filter';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  app.enableCors();
  app.useGlobalFilters(new AllExceptionsFilter());

  app.use( bodyParser.json({ limit: '10mb' }) );
  app.use( bodyParser.urlencoded({ limit: '10mb', extended: true }) );

  await app.listen(process.env.PORT ?? 3000);
}


bootstrap();
