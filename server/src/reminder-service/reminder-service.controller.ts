import { Controller } from '@nestjs/common';
import { ReminderServiceService } from './reminder-service.service';

@Controller('reminder-service')
export class ReminderServiceController {
  constructor(private readonly reminderServiceService: ReminderServiceService) {}
}
