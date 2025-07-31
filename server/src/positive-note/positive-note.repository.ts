import { Injectable } from '@nestjs/common';
import { Entry, PrismaClient } from 'generated/prisma';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';

@Injectable()
export class PositiveNoteRepository {
  constructor(private prisma: PrismaClient) {}

  async createPositiveNote(
    createPositiveNoteDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    const { imageUrls, ...entryData } = createPositiveNoteDto;
    const result = await this.prisma.entry.create({
      data: {
        ...entryData,
        entryImage: {
          create: imageUrls?.map((url) => ({ url })) || [],
        },
      },
      include: {
        entryImage: true,
      },
    });
    return result;
  }
}
