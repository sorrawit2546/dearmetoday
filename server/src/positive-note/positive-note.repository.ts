import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Entry } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
  UpdatePositiveNoteDeleteDto,
  UpdatePositiveNoteDto,
} from './Dto/create-positive-note';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { moodToScore } from './utils/positive-note.mood.utils';
import { SummaryGateway } from 'src/summary/summary.gateway';

@Injectable()
export class PositiveNoteRepository {
  constructor(
    private prisma: PrismaService,
    private summaryGateway: SummaryGateway,
  ) {}

  async deletePositiveNoteById(
    noteId: string,
    userId: string,
    Dto: UpdatePositiveNoteDeleteDto,
  ): Promise<Entry> {
    const note = await this.prisma.entry.findFirst({
      where: { id: noteId, userId },
    });
    if (!note) {
      throw new UnauthorizedException('Not your note');
    }
    return this.prisma.entry.update({
      where: {
        id: noteId,
      },
      data: {
        isDelete: Dto.isDelete,
      },
    });
  }

  async editPositiveNoteById(
    noteId: string,
    userId: string,
    Dto: UpdatePositiveNoteDto,
  ): Promise<Entry> {
    const cleanDto = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(Dto).filter(([_, v]) => v !== undefined), // ✅ อย่า filter null/'' ทิ้ง
    );

    // Prisma scalar list fields require `{ set: [...] }` when updating
    const data: Record<string, unknown> = { ...cleanDto };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (Array.isArray((cleanDto as any).imageUrls)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      data.imageUrls = { set: (cleanDto as any).imageUrls as string[] };
    }

    const updated = await this.prisma.entry.update({
      where: { id: noteId, userId },
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: data as any,
    });

    return updated;
  }

  async getPositiveNoteById(noteId: string, userId: string): Promise<Entry> {
    const result = await this.prisma.entry.findFirst({
      where: {
        id: noteId,
        userId: userId,
      },
    });
    return result;
  }

  async getAllNotesCommunity() {
    return await this.prisma.entry.findMany({
      where: {
        showMessage: true,
        isDelete: false, // กรอง note ที่ถูกลบออก
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
    this.summaryGateway.notify(userId);
    return result;
  }

  async getAllNoteById(userId: string): Promise<getAllNoteSendById[]> {
    const entries = await this.prisma.entry.findMany({
      where: { userId: userId, isDelete: false },
    });

    const result: getAllNoteSendById[] = entries.map((e) => ({
      id: e.id,
      email: e.email,
      line1: e.line1,
      imageUrls: e.imageUrls,
      mood: e.mood,
      createdAt: e.createdAt,
      isDelete: e.isDelete,
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
