import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
} from './Dto/create-positive-note';
import { getAllNoteSendById } from './entity/positive-note.entity';

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

  async getAllNoteById(userId: string): Promise<getAllNoteSendById[]> {
    const entries = await this.prisma.entry.findMany({
      where: { userId: userId },
    });

    const result: getAllNoteSendById[] = entries.map((e) => ({
      id: e.id,
      email: e.email,
      line1: e.line1,
      imageUrls: e.imageUrls,
      mood: e.mood,
      createdAt: e.createdAt,
    }));
    return result;
  }

  async recentNoteByUserId(userId: string): Promise<getAllNoteSendById> {
    const data = await this.prisma.entry.findFirst({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const result: getAllNoteSendById = data;
    return result;
  }
}
