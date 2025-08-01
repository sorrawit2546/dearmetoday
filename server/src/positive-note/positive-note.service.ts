// positive-note.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PositiveNoteRepository } from './positive-note.repository';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { Entry } from '@prisma/client';

@Injectable()
export class PositiveNoteService {
  constructor(
    private readonly repositoryPositiveNote: PositiveNoteRepository,
  ) {}

  async createPositiveNote(
    createEntryDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    try {
      const result =
        await this.repositoryPositiveNote.createPositiveNote(createEntryDto);
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException();
      }
      throw new BadGatewayException(['Bad gateway']);
    }
  }
}
