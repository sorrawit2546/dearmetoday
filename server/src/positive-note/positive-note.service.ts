// positive-note.service.ts
import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Entry } from '@prisma/client';
import { SendgridService } from '../third-party/sendgrid/sendgrid.service';
import {
  CreatePositiveNoteAuthDto,
  CreatePositiveNoteDto,
  UpdatePositiveNoteDeleteDto,
  UpdatePositiveNoteDto,
} from './Dto/create-positive-note';
import {
  getAllNotesCommunity,
  getAllNoteSendById,
  getAllNoteSendByIdResponse,
  IpositiveNoteByNoteId,
} from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';
import { CalendarService } from '../calendar/calendar.service';
import { ResendService } from '../third-party/resend/resend.service';

@Injectable()
export class PositiveNoteService {
  constructor(
    private readonly repositoryPositiveNote: PositiveNoteRepository,
    private readonly sendgridService: SendgridService,
    private readonly calendarService: CalendarService,
    private readonly resendService: ResendService,
  ) {}

  async getAllPositiveNoteInDearme() {
    return await this.repositoryPositiveNote.getAllPositiveNoteInDearme();
  }

  async deletePositiveNoteById(
    noteId: string,
    userId: string,
    Dto: UpdatePositiveNoteDeleteDto,
  ): Promise<string> {
    if (!noteId || !userId) {
      throw new UnauthorizedException('UserId or NoteId Not found!');
    }
    if (Dto === undefined || Dto === null) {
      throw new UnauthorizedException('isDelete Not found!');
    }
    await this.repositoryPositiveNote.deletePositiveNoteById(
      noteId,
      userId,
      Dto,
    );
    return 'Positive Note is Deleted!';
  }

  async editPositiveNoteById(
    noteId: string,
    userId: string,
    Dto: UpdatePositiveNoteDto,
  ): Promise<Entry> {
    try {
      if (!noteId || !userId) {
        throw new UnauthorizedException('UserId or NoteId Not found!');
      }
      if (!Dto) {
        throw new UnauthorizedException('UserId or NoteId Not found!');
      }
      const rawResult = await this.repositoryPositiveNote.editPositiveNoteById(
        noteId,
        userId,
        Dto,
      );
      return rawResult;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new BadRequestException(error);
      }
    }
  }
  async getPositiveNoteById(
    noteId: string,
    userId: string,
  ): Promise<IpositiveNoteByNoteId> {
    try {
      if (!noteId || !userId) {
        throw new UnauthorizedException('UserId or NoteId Not found!');
      }
      const rawResult = await this.repositoryPositiveNote.getPositiveNoteById(
        noteId,
        userId,
      );
      return rawResult;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new BadRequestException(error);
      }
    }
  }

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
    accessToken?: string,
  ): Promise<Entry> {
    try {
      const result =
        await this.repositoryPositiveNote.createPositiveNote(createEntryDto);
      // ส่งอีเมลเฉพาะเมื่อมี email
      if (createEntryDto.email) {
        try {
          await this.resendService.sendPositiveNoteEmail(
            createEntryDto.email,
            createEntryDto.imageUrls,
            createEntryDto.line1,
            createEntryDto?.line2,
            createEntryDto?.line3,
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
      if (!accessToken) {
        throw new UnauthorizedException('No access token provided');
      }
      if (accessToken) {
        try {
          const description = [
            `📝 ${createEntryDto.line1}`,
            createEntryDto.line2 && `📝 ${createEntryDto.line2}`,
            createEntryDto.line3 && `📝 ${createEntryDto.line3}`,
            createEntryDto.imageUrls?.length
              ? createEntryDto.imageUrls
                  .map((url, i) => `📷 Image ${i + 1}: ${url}`)
                  .join('\n')
              : null,
          ]
            .filter(Boolean)
            .join('\n\n');
          await this.calendarService.createPositiveNoteEvent(accessToken, {
            line1: description,
            mood: createEntryDto.mood,
            imageUrl: createEntryDto.imageUrls ?? [],
          });
        } catch (error) {
          console.warn(
            'Calendar create event failed, continue without calendar:',
            error,
          );
        }
      } else {
        console.log('Skip Calendar');
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
      const result = await this.repositoryPositiveNote.getAllNoteById(userId);
      const mapResult: getAllNoteSendById[] = result.map((e) => ({
        id: e.id,
        email: e.email,
        line1: e.line1,
        imageUrls: e.imageUrls,
        mood: e.mood,
        createdAt: e.createdAt,
        isDelete: e.isDelete,
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
      // const mapResult: getAllNoteSendById[] = result.slice(0, 12);
      return result;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadGatewayException('External service unavailable');
    }
  }
}
