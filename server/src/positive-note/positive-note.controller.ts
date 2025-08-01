import { Body, Controller, Post } from '@nestjs/common';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { Entry } from '@prisma/client';
import { PositiveNoteService } from './positive-note.service';

@Controller('positive-note')
export class PositiveNoteController {
  constructor(private readonly positivenoteService: PositiveNoteService) {}

  @Post('create')
  async createPositiveNote(
    @Body() createDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    return this.positivenoteService.createPositiveNote(createDto);
  }
}
