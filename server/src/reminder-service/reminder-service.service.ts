import { Injectable } from '@nestjs/common';
import { ReminderServiceRepository } from './reminder-service.repository';
import { ResendService } from 'src/third-party/resend/resend.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ReminderServiceService {
  constructor(
    private reminderRepository: ReminderServiceRepository,
    private resendService: ResendService,
  ) {
    console.log('[CRON] ReminderServiceService CREATED');
  }

  isAfter18(): boolean {
    const now = new Date(
      new Date().toLocaleString('en-US', { timeZone: 'Asia/Bangkok' }),
    );

    console.log('[CRON] now Asia/Bangkok:', now.toString());
    console.log('[CRON] hour =', now.getHours());

    const cutoff = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      18,
      0,
      0,
    );

    return now >= cutoff;
  }

  @Cron('0 */10 * * * *')
  async checkAllUsersDailyReminder() {
    console.log('[CRON] triggered:', new Date().toISOString());
    if (!this.isAfter18()) {
      console.log('[CRON] skipped because time < 18:00');
      return;
    }
    const allUser = await this.reminderRepository.getAllUser();
    for (const users of allUser) {
      const hasNote = await this.reminderRepository.checkUserWriteNoteToday(
        users.id,
      );
      if (!hasNote) {
        await this.resendService.sendReminderEmail(users.email, users.name);
      }
    }
    console.log('[CRON] passed time check');
  }
}
