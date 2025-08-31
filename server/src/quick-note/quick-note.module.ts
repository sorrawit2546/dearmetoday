import { Module } from '@nestjs/common';
import { QuickNoteService } from './quick-note.service';
import { QuickNoteController } from './quick-note.controller';

@Module({
  providers: [QuickNoteService],
  controllers: [QuickNoteController],
})
export class QuickNoteModule {}
