import { Test, TestingModule } from '@nestjs/testing';
import * as jwt from 'jsonwebtoken';
import { QuickNoteController } from './quick-note.controller';
import { QuickNoteService } from './quick-note.service';
import { quickNoteDto } from './Dto/quick-note.dto';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));
interface ReqCookie {
  user?: unknown;
  cookies?: Record<string, string>;
}

describe('QuickNoteController', () => {
  let controller: QuickNoteController;
  let service: QuickNoteService;
  const mockServiceFunction = {
    createQuickNote: jest.fn(),
    getAllQuickNote: jest.fn(),
  };
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

  describe('quick-not', () => {
    it('Should be create quick-note', async () => {
      const mockReq: ReqCookie = {
        cookies: {
          access_token: 'mock-token',
        },
      };
      const mockUserId = 'user-123';
      const mockQuickNote = 'test thank message!!!';
      const quickNoteDto: quickNoteDto = {
        id: 'quick-note-1',
        thankMessage: 'thank-message!',
        isDelete: false,
        createdAt: new Date(),
        userId: 'user-123',
      };
      const mockResult = {
        id: 'quick-note-1',
        thankMessage: 'thank-message!',
        isDelete: 'false',
        createdAt: '1-10-2568',
        user_id: 'user-123',
      };
      // Mock jwt.verify ให้คืนค่า payload ที่ต้องการ
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      //act
      mockServiceFunction.createQuickNote = jest.fn().mockReturnValue({
        id: 'quick-note-1',
        thankMessage: 'thank-message!',
        isDelete: 'false',
        createdAt: '1-10-2568',
        user_id: 'user-123',
      });
      const result = await controller.createQuickNote(
        mockReq as any,
        quickNoteDto,
      );
      expect(result).toEqual(mockResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
    });

    it('should get all quick-note', async () => {
      const mockReq: ReqCookie = {
        cookies: {
          access_token: 'mock-token',
        },
      };
      // Mock jwt.verify ให้คืนค่า payload ที่ต้องการ
      (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      const mockResult = [
        {
          id: 'quick-note-1',
          thankMessage: 'thank-message!',
          isDelete: false, // ใช้ boolean ดีกว่า string
          createdAt: '1-10-2568',
          user_id: 'user-123',
        },
        {
          id: 'quick-note-2',
          thankMessage: 'thank-message!',
          isDelete: false,
          createdAt: '1-10-2568',
          user_id: 'user-123',
        },
      ];
      mockServiceFunction.getAllQuickNote = jest
        .fn()
        .mockReturnValue(mockResult);
      //act
      const result = await controller.getAllQuickNote(mockReq as any);
      expect(result).toEqual(mockResult);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getAllQuickNote).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(service.getAllQuickNote).toHaveBeenCalledWith('user-123');
    });
  });
});
