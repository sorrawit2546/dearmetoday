import { Module } from '@nestjs/common';
import { QuickNoteService } from './quick-note.service';
import { QuickNoteController } from './quick-note.controller';
import { QuickNoteRepository } from './quick-note.repository';

@Module({
  providers: [QuickNoteService, QuickNoteRepository],
  controllers: [QuickNoteController],
})
export class QuickNoteModule {}
