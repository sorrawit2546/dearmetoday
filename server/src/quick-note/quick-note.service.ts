import { Injectable } from '@nestjs/common';
import { QuickNoteRepository } from './quick-note.repository';
import { ThankMessage } from '@prisma/client';
import { quickNoteDto } from './Dto/quick-note.dto';

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

  async getAllQuickNote(userId: string) {}
}
