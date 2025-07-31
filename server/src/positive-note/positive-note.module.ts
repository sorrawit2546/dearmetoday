import { Module } from '@nestjs/common';
import { PositiveNoteService } from './positive-note.service';
import { PositiveNoteController } from './positive-note.controller';

@Module({
  providers: [PositiveNoteService],
  controllers: [PositiveNoteController],
})
export class PositiveNoteModule {}
