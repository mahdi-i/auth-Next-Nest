import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import dataSource from '@shared/config/data-source';
import { initSwagger } from '@shared/config/swagger.config';
import { AllExceptionsFilter } from '@shared/filter/exception.filter';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(cookieParser());

  await dataSource.initialize();

  initSwagger(app);

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(process.env.PORT ?? 3001, async () => {
    Logger.log(`Server run on port :  ${process.env.PORT}`, 'AppLogger');
    Logger.log(`docs on :  ${await app.getUrl()}/docs`, 'AppLogger');
  });
}
bootstrap();
