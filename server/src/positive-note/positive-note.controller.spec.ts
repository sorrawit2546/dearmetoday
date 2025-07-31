import { Test, TestingModule } from '@nestjs/testing';
import { PositiveNoteController } from './positive-note.controller';

describe('PositiveNoteController', () => {
  let controller: PositiveNoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositiveNoteController],
    }).compile();

    controller = module.get<PositiveNoteController>(PositiveNoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
