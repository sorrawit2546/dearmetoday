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
      21,
      0,
      0,
    );

    return now >= cutoff;
  }

  @Cron('0 0 21 * * *')
  async checkAllUsersDailyReminder() {
    console.log('[CRON] triggered:', new Date().toISOString());
    if (!this.isAfter18()) return;

    const allUser = await this.reminderRepository.getAllUser();

    for (const user of allUser) {
      const hasNote = await this.reminderRepository.checkUserWriteNoteToday(
        user.id,
      );

      if (!hasNote) {
        try {
          await this.resendService.sendReminderEmail(user.email, user.name);
          console.log('[CRON] sent to', user.email);

          // ป้องกัน rate-limit → 500ms - 1s พอ
          await new Promise((resolve) => setTimeout(resolve, 800));
        } catch (error) {
          console.error('[CRON] failed for', user.email, error.message);
        }
      }
    }

    console.log('[CRON] finished all users');
  }
}
