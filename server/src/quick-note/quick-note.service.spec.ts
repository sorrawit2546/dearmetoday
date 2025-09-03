import { Test, TestingModule } from '@nestjs/testing';
import { QuickNoteService } from './quick-note.service';
import { QuickNoteRepository } from './quick-note.repository';
import { quickNoteDto } from './Dto/quick-note.dto';

describe('QuickNoteService', () => {
  let service: QuickNoteService;
  let repository: QuickNoteRepository;
  const mockRepository = {
    createQuickNote: jest.fn(),
    getAllQuickNote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuickNoteService,
        {
          provide: QuickNoteRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<QuickNoteService>(QuickNoteService);
    repository = module.get<QuickNoteRepository>(QuickNoteRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should be defined', () => {
    expect(repository).toBeDefined();
  });
  it('should create quick note and call quick-note repository', async () => {
    //1.mock
    const mockUserId = 'user-123';
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
    mockRepository.createQuickNote = jest.fn().mockReturnValue({
      id: 'quick-note-1',
      thankMessage: 'thank-message!',
      isDelete: 'false',
      createdAt: '1-10-2568',
      user_id: 'user-123',
    });
    //2
    const result = await service.createQuickNote(mockUserId, quickNoteDto);
    expect(result).toEqual(mockResult);
    expect(mockRepository.createQuickNote).toHaveBeenCalledWith(
      mockUserId,
      quickNoteDto,
    );
    expect(mockRepository.createQuickNote).toHaveBeenCalledTimes(1);
  });
  it('should get all quick-note message', async () => {
    const mockUserId = 'user-123';
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
    mockRepository.getAllQuickNote = jest.fn().mockReturnValue(mockResult);
    const result = await service.getAllQuickNote(mockUserId);
    expect(result).toEqual(mockResult);
    expect(mockRepository.getAllQuickNote).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAllQuickNote).toHaveBeenCalledWith(mockUserId);
  });
});
