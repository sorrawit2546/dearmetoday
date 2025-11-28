import { Test, TestingModule } from '@nestjs/testing';
import { ReminderServiceController } from './reminder-service.controller';
import { ReminderServiceService } from './reminder-service.service';

describe('ReminderServiceController', () => {
  let controller: ReminderServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderServiceController],
      providers: [ReminderServiceService],
    }).compile();

    controller = module.get<ReminderServiceController>(ReminderServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
