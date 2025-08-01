import { Module } from '@nestjs/common';
import { PositiveNoteService } from './positive-note.service';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteRepository } from './positive-note.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PositiveNoteService, PositiveNoteRepository],
  controllers: [PositiveNoteController],
})
export class PositiveNoteModule {}
