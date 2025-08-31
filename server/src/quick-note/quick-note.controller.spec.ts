import { Test, TestingModule } from '@nestjs/testing';
import { QuickNoteController } from './quick-note.controller';
import { QuickNoteService } from './quick-note.service';
import * as jwt from 'jsonwebtoken';
interface ReqCookie {
  user?: unknown;
  cookies?: Record<string, string>;
}

describe('QuickNoteController', () => {
  let controller: QuickNoteController;
  let service: QuickNoteService;
  const mockServiceFunction = {
    createQuickNote: jest.fn(),
  };
  jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
  }));
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuickNoteController],
      providers: [
        {
          provide: QuickNoteService,
          useValue: mockServiceFunction,
        },
      ],
    }).compile();

    controller = module.get<QuickNoteController>(QuickNoteController);
    service = module.get<QuickNoteService>(QuickNoteService);
    (jwt.verify as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create quick-not', () => {
    it('Should be create quick-note', () => {
      let mockQuickNote = 'test thank message!!!';
      const mockResult = [
        {
          id: 'quick-note-1',
          thankMessage: 'thank-message!',
        },
      ];
    });
  });
});
