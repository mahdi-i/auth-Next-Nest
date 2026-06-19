import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { initSwagger } from './common/config/swagger.config';
import { AllExceptionsFilter } from './common/filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());
  initSwagger(app);
  await app.listen(3001);
}
bootstrap();
