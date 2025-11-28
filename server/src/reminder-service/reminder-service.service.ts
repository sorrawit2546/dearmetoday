import { Injectable } from '@nestjs/common';
import { ReminderServiceRepository } from './reminder-service.repository';
import { ResendService } from 'src/third-party/resend/resend.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReminderServiceService {
  constructor(
    private reminderRepository: ReminderServiceRepository,
    private resendService: ResendService,
  ) {}

  isAfter21(): boolean {
    const now = new Date();
    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      21,
      0,
      0,
    );
    return now >= cutoff;
  }

  @Cron('0 */10 * * * *')
  async checkAllUsersDailyReminder() {
    if (!this.isAfter21()) return;
    const allUser = await this.reminderRepository.getAllUser();
    for (const users of allUser) {
      const hasNote = await this.reminderRepository.checkUserWriteNoteToday(
        users.id,
      );
      if (!hasNote) {
        await this.resendService.sendReminderEmail(users.email, users.name);
      }
    }
  }
}
