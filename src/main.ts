import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serwowanie plików statycznych z folderu public
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/',
  });

  const corsOrigin = (process.env.CORS_ORIGIN || '').trim();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );
  const allowedOrigins = corsOrigin
    ? corsOrigin.split(',').map(s => s.trim()).filter(Boolean)
    : ['http://localhost:4200'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.indexOf('*') !== -1) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();