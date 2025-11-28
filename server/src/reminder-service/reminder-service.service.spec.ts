import { Test, TestingModule } from '@nestjs/testing';
import { ReminderServiceService } from './reminder-service.service';

describe('ReminderServiceService', () => {
  let service: ReminderServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderServiceService],
    }).compile();

    service = module.get<ReminderServiceService>(ReminderServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
