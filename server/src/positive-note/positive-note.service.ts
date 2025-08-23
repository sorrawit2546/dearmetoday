// positive-note.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Entry } from '@prisma/client';
import { SendgridService } from '../third-party/sendgrid/sendgrid.service';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
} from './Dto/create-positive-note';
import {
  getAllNotesCommunity,
  getAllNoteSendById,
  getAllNoteSendByIdResponse,
} from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';
import { error } from 'console';
import { map } from 'rxjs';

@Injectable()
export class PositiveNoteService {
  constructor(
    private readonly repositoryPositiveNote: PositiveNoteRepository,
    private readonly sendgridService: SendgridService,
  ) {}

  async getAllCommunityNote(): Promise<getAllNotesCommunity[]> {
    // throw new Error('Method not implemented yet');
    const rawData = await this.repositoryPositiveNote.getAllNotesCommunity();
    const result: getAllNotesCommunity[] = rawData.map((data) => ({
      id: data.id,
      email: data.email,
      line1: data.line1,
      line2: data.line2 ?? null,
      line3: data.line3 ?? null,
      imageUrls: data.imageUrls ?? [],
      mood: data.mood,
      showMessage: data.showMessage,
      isDelete: data.isDelete,
      createdAt: data.createdAt,
      userId: data.userId,
      user: {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        avatarUrl: data.user.avatarUrl,
      },
    }));
    return result;
  }
  async createPositiveNote(
    createEntryDto: CreatePositiveNoteDto | CreatePositiveNoteAuthDto,
  ): Promise<Entry> {
    try {
      const result =
        await this.repositoryPositiveNote.createPositiveNote(createEntryDto);

      // ส่งอีเมลเฉพาะเมื่อมี email
      if (createEntryDto.email) {
        try {
          await this.sendgridService.sendPositiveNoteEmail(
            createEntryDto.email,
            createEntryDto.imageUrls,
            createEntryDto.line1,
          );
        } catch (emailError: unknown) {
          const error = emailError as Error & {
            response?: { body?: unknown; statusCode?: number };
          };
          console.error('SendGrid Error Details:', {
            message: error.message,
            response: error.response?.body,
            statusCode: error.response?.statusCode,
            fullError: JSON.stringify(error, null, 2),
          });
          // ไม่ throw error เพื่อให้บันทึกข้อมูลได้แม้ส่งเมลไม่สำเร็จ
        }
      }

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException();
      }
      throw new BadGatewayException(['Bad gateway']);
    }
  }

  async getAllNoteByUserId(
    userId: string,
  ): Promise<getAllNoteSendByIdResponse> {
    try {
      console.log('userId', userId);
      const result = await this.repositoryPositiveNote.getAllNoteById(userId);
      const mapResult: getAllNoteSendById[] = result.map((e) => ({
        id: e.id,
        email: e.email,
        line1: e.line1,
        imageUrls: e.imageUrls,
        mood: e.mood,
        createdAt: e.createdAt,
      }));
      const countNote = mapResult.length;

      return {
        data: {
          mapResult,
          countNote,
        },
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async recentNoteByUserId(userId: string): Promise<getAllNoteSendById> {
    const result = await this.repositoryPositiveNote.recentNoteByUserId(userId);
    return result;
  }

  async getAllpositiveNotesWithoutLatest(
    userId: string,
  ): Promise<getAllNoteSendById[]> {
    try {
      if (!userId) {
        throw new BadRequestException(['UserId it not contain!']);
      }
      const result =
        await this.repositoryPositiveNote.getAllpositiveNotesWithoutLatest(
          userId,
        );
      const mapResult: getAllNoteSendById[] = result.slice(0, 12);
      return mapResult;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadGatewayException('External service unavailable');
    }
  }
}
