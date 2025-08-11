import { Test, TestingModule } from '@nestjs/testing';
import { Mood } from '@prisma/client';
import { SendgridService } from '../third-party/sendgrid/sendgrid.service';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';
import { PositiveNoteService } from './positive-note.service';

describe('PositiveNoteService', () => {
  let service: PositiveNoteService;

  const mockRepository = {
    createPositiveNote: jest.fn(),
    getAllNoteById: jest.fn(),
    recentNoteByUserId: jest.fn(),
  };

  const mockSendgridService = {
    sendPositiveNoteEmail: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositiveNoteService,
        {
          provide: PositiveNoteRepository,
          useValue: mockRepository,
        },
        {
          provide: SendgridService,
          useValue: mockSendgridService,
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

  it('should get all note by userId', async () => {
    const mockNotes: getAllNoteSendById[] = [
      {
        id: 'note-1',
        email: 'john.doe@example.com',
        line1: 'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ',
        imageUrls: [
          'https://via.placeholder.com/400x300?text=Park+View',
          'https://via.placeholder.com/400x300?text=Sunset',
        ],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:30:00Z'),
      },
      {
        id: 'note-2',
        email: 'jane.smith@example.com',
        line1: 'ฝนตกทั้งวัน เลยอยู่บ้านอ่านหนังสือ',
        imageUrls: ['https://via.placeholder.com/400x300?text=Rainy+Day'],
        mood: Mood.neutral,
        createdAt: new Date('2025-08-08T15:45:00Z'),
      },
      {
        id: 'note-3',
        email: 'test.user@example.com',
        line1: 'เพิ่งได้ลองร้านกาแฟใหม่ใกล้บ้าน อร่อยมาก',
        imageUrls: [
          'https://via.placeholder.com/400x300?text=Coffee+Shop',
          'https://via.placeholder.com/400x300?text=Latte+Art',
        ],
        mood: Mood.sad,
        createdAt: new Date('2025-08-07T08:00:00Z'),
      },
    ];
    mockRepository.getAllNoteById = jest.fn().mockResolvedValue(mockNotes);
    const mockUser = 'user-1';
    const result = await service.getAllNoteByUserId(mockUser);
    expect(result.data.mapResult).toEqual(mockNotes);
    expect(result.data.countNote).toBe(mockNotes.length);
    expect(mockRepository.getAllNoteById).toHaveBeenCalledWith('user-1');
  });

  it('should be get recent note post by userId', async () => {
    //mock
    const mockUserId = 'mock-user1';
    const mockResult: getAllNoteSendById = {
      id: 'note-1',
      email: 'john.doe@example.com',
      line1: 'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ',
      imageUrls: [
        'https://via.placeholder.com/400x300?text=Park+View',
        'https://via.placeholder.com/400x300?text=Sunset',
      ],
      mood: Mood.happy,
      createdAt: new Date('2025-08-09T10:30:00Z'),
    };
    //mock repository
    mockRepository.recentNoteByUserId = jest.fn().mockReturnValue(mockResult);
    const result = await service.recentNoteByUserId(mockUserId);
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledWith(mockUserId);
  });
});
