import { Injectable, UnauthorizedException } from '@nestjs/common';
import { QuickNoteRepository } from './quick-note.repository';
import { ThankMessage } from '@prisma/client';
import { quickNoteDto } from './Dto/quick-note.dto';
import { quickNoteResult } from './Entity/quick-note.entity';

@Injectable()
export class QuickNoteService {
  constructor(private readonly quickNoteRepository: QuickNoteRepository) {}
  async createQuickNote(
    user_id: string | null,
    quicknoteDto: quickNoteDto,
  ): Promise<ThankMessage> {
    console.log(user_id);
    return await this.quickNoteRepository.createQuickNote(
      user_id,
      quicknoteDto,
    );
  }

  async getAllQuickNote(userId: string): Promise<quickNoteResult[]> {
    if (!userId) {
      throw new UnauthorizedException(['User Id not found!']);
    }
    return await this.quickNoteRepository.getAllQuickNote(userId);
  }
}
