import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // ทำให้ใช้ได้ทั่วทั้งแอปโดยไม่ต้อง import หลายรอบ
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
