import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser()); // ✅ ใส่ตรงนี้
  
  // ปรับปรุง CORS configuration
  app.enableCors({
    origin: 'http://localhost:4200',
    credentials: true, // ต้องเปิดเพื่อให้ cookie ทำงาน
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // ✅ กำหนดให้ทุก route มี prefix เป็น /api
  app.setGlobalPrefix('api');

  // เปิดใช้งาน validation pipe สำหรับ class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  app.use(passport.initialize());
  const port = process.env.PORT || 3000;
  console.log(`🚀 Server running on port ${port}`);
  await app.listen(port);
}

bootstrap();
