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
  getAllNoteSendById,
  getAllNoteSendByIdResponse,
} from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';

@Injectable()
export class PositiveNoteService {
  constructor(
    private readonly repositoryPositiveNote: PositiveNoteRepository,
    private readonly sendgridService: SendgridService,
  ) {}

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
}
