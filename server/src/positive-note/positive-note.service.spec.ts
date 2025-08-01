import { Test, TestingModule } from '@nestjs/testing';
import { PositiveNoteService } from './positive-note.service';
import { PositiveNoteRepository } from './positive-note.repository';

describe('PositiveNoteService', () => {
  let service: PositiveNoteService;

  const mockRepository = {
    createPositiveNote: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositiveNoteService,
        {
          provide: PositiveNoteRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PositiveNoteService>(PositiveNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be create positiveNote', async () => {
    const positiveNoteDto = {
      line1: 'Test Positive note',
      line2: null,
      line3: null,
      email: 'sangmanee773@gmail.com',
      mood: 'happy' as const,
      imageUrls: ['url1', 'url2'],
    };
    const mockResult = {
      id: 'uuid-1234',
      email: 'sangmanee773@gmail.com',
      line1: 'Test Positive note',
      line2: null,
      line3: null,
      imageUrls: [
        'https://example.com/img1.png',
        'https://example.com/img2.png',
      ],
      mood: 'happy',
      showMessage: false,
      isDelete: false,
      createdAt: new Date(),
      userId: null,
    };

    mockRepository.createPositiveNote = jest.fn().mockResolvedValue(mockResult);

    const result = await service.createPositiveNote(positiveNoteDto);

    expect(result).toEqual(mockResult);
  });

  it('should create note without optional fields', async () => {
    const dto = {
      line1: 'Only line1',
      email: 'user@example.com',
      mood: 'sad' as const,
    };

    const expected = {
      id: 'uuid-9999',
      email: 'user@example.com',
      line1: 'Only line1',
      line2: null,
      line3: null,
      imageUrls: [],
      mood: 'sad',
      showMessage: false,
      isDelete: false,
      createdAt: new Date(),
      userId: null,
    };

    mockRepository.createPositiveNote = jest.fn().mockResolvedValue(expected);

    const result = await service.createPositiveNote(dto);

    expect(result).toEqual(expected);
  });
});
