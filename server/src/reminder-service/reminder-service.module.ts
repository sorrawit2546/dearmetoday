import { Module } from '@nestjs/common';
import { ReminderServiceService } from './reminder-service.service';
import { ReminderServiceController } from './reminder-service.controller';

@Module({
  controllers: [ReminderServiceController],
  providers: [ReminderServiceService],
})
export class ReminderServiceModule {}
