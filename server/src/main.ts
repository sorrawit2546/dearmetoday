import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิดใช้งาน CORS ถ้าต้องการเชื่อมจาก frontend
  app.enableCors();

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

  const port = process.env.PORT || 3000;
  console.log(`🚀 Server running on port ${port}`);
  await app.listen(port);
}

bootstrap();
