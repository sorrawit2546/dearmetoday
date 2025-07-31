// positive-note.service.ts
import { Injectable } from '@nestjs/common';
import { PositiveNoteRepository } from './positive-note.repository';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { Entry } from 'generated/prisma';

@Injectable()
export class PositiveNoteService {
  constructor(private readonly repository: PositiveNoteRepository) {}

  async createPositiveNote(
    createEntryDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    const result = await this.repository.createPositiveNote(createEntryDto);
    return result;
  }
}
