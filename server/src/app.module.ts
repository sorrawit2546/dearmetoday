import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositiveNoteModule } from './positive-note/positive-note.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PositiveNoteModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
