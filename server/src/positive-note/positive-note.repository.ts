import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';
import {
  CreatePositiveNoteDto,
  CreatePositiveNoteAuthDto,
} from './Dto/create-positive-note';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PositiveNoteRepository {
  constructor(private prisma: PrismaService) {}

  async createPositiveNote(
    createPositiveNoteDto: CreatePositiveNoteDto | CreatePositiveNoteAuthDto,
  ): Promise<Entry> {
    let userId: string | null = null;

    // ใช้ email จาก DTO (ที่มาจาก token หรือ body)
    if (createPositiveNoteDto.email) {
      const user = await this.prisma.user.findUnique({
        where: { email: createPositiveNoteDto.email },
        select: {
          id: true,
        },
      });

      if (user) {
        userId = user.id;
      }
    }

    const result = await this.prisma.entry.create({
      data: {
        line1: createPositiveNoteDto.line1,
        line2: createPositiveNoteDto.line2,
        line3: createPositiveNoteDto.line3,
        email: createPositiveNoteDto.email || '',
        mood: createPositiveNoteDto.mood,
        showMessage: createPositiveNoteDto.showMessage,
        isDelete: createPositiveNoteDto.isDelete,
        imageUrls: createPositiveNoteDto.imageUrls || [],
        userId: userId,
      },
    });
    return result;
  }
}
