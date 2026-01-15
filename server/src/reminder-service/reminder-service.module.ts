import { Module } from '@nestjs/common';
import { ReminderServiceService } from './reminder-service.service';
import { ReminderServiceController } from './reminder-service.controller';
import { ReminderServiceRepository } from './reminder-service.repository';
import { ResendService } from 'src/third-party/resend/resend.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReminderServiceController],
  providers: [ReminderServiceService, ReminderServiceRepository, ResendService],
  exports: [ReminderServiceService, ReminderServiceRepository],
})
export class ReminderServiceModule {}
