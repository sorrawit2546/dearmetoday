import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositiveNoteRepository {
  constructor(private prisma: PrismaService) {}

  async createPositiveNote(
    createPositiveNoteDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    const result = await this.prisma.entry.create({
      data: {
        ...createPositiveNoteDto,
      },
    });
    return result;
  }
}
