import { Injectable } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
} from './Dto/create-positive-note';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { moodToScore } from './utils/positive-note.mood.utils';

@Injectable()
export class PositiveNoteRepository {
  constructor(private prisma: PrismaService) {}

  async getAllNotesCommunity() {
    return await this.prisma.entry.findMany({
      where: {
        showMessage: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  async createPositiveNote(
    createPositiveNoteDto: CreatePositiveNoteDto | CreatePositiveNoteAuthDto,
  ): Promise<Entry> {
    let userId: string | null = null;
    const moodScore = moodToScore(createPositiveNoteDto.mood);
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
        moodScore: moodScore,
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

  async getAllpositiveNotesWithoutLatest(
    userId: string,
  ): Promise<getAllNoteSendById[]> {
    const resultRecentNoteByUserId = this.recentNoteByUserId(userId);
    return await this.prisma.entry.findMany({
      where: {
        userId: userId,
        id: { not: (await resultRecentNoteByUserId).id },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
