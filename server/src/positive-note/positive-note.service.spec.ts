import { Test, TestingModule } from '@nestjs/testing';
import { PositiveNoteService } from './positive-note.service';

describe('PositiveNoteService', () => {
  let service: PositiveNoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PositiveNoteService],
    }).compile();

    service = module.get<PositiveNoteService>(PositiveNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
