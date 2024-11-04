import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvConfigService } from './config/env.config';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ApiPrefix } from './common/constants/api-prefix.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(ApiPrefix.VERSION);
  const configService = app.get(EnvConfigService);
  const port = configService.getPort('PORT') || 3000;
  console.log('Server listening on port', port ?? 3000);
  console.log('Current NODE_ENV:', process.env.NODE_ENV);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Sử dụng custom exception filter
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(port ?? 3000);
}
bootstrap();
