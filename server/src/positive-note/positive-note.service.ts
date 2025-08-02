// positive-note.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Entry } from '@prisma/client';
import { SendgridService } from 'src/third-party/sendgrid/sendgrid.service';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PositiveNoteRepository } from './positive-note.repository';

@Injectable()
export class PositiveNoteService {
  constructor(
    private readonly repositoryPositiveNote: PositiveNoteRepository,
    private readonly sendgridService: SendgridService,
  ) {}

  async createPositiveNote(
    createEntryDto: CreatePositiveNoteDto,
  ): Promise<Entry> {
    try {
      const result =
        await this.repositoryPositiveNote.createPositiveNote(createEntryDto);

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

      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException();
      }
      throw new BadGatewayException(['Bad gateway']);
    }
  }
}
