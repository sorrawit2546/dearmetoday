import { Module } from '@nestjs/common';
import { PositiveNoteService } from './positive-note.service';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteRepository } from './positive-note.repository';
import { PrismaModule } from '../prisma/prisma.module';
import { SendgridModule } from '../third-party/sendgrid/sendgrid.module';
import { CalendarModule } from 'src/calendar/calendar.module';
import { SummaryModule } from 'src/summary/summary.module';

@Module({
  imports: [PrismaModule, SendgridModule, CalendarModule, SummaryModule],
  providers: [PositiveNoteService, PositiveNoteRepository],
  controllers: [PositiveNoteController],
})
export class PositiveNoteModule {}
