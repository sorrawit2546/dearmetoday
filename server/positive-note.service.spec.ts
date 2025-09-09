import { Test, TestingModule } from '@nestjs/testing';
import { Mood } from '@prisma/client';
import { SendgridService } from '../third-party/sendgrid/sendgrid.service';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';
import { PositiveNoteService } from './positive-note.service';
import { CalendarService } from '../calendar/calendar.service';

describe('PositiveNoteService', () => {
  let service: PositiveNoteService;

  const mockRepository = {
    createPositiveNote: jest.fn(),
    getAllNoteById: jest.fn(),
    recentNoteByUserId: jest.fn(),
    getAllpositiveNotesWithoutLatest: jest.fn(),
    getAllNotesCommunity: jest.fn(),
  };

  const mockSendgridService = {
    sendPositiveNoteEmail: jest.fn().mockResolvedValue(undefined),
  };

  const mockCalendarService = {
    createPositiveNoteEvent: jest.fn().mockResolvedValue(undefined),
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
        {
          provide: CalendarService,
          useValue: mockCalendarService,
        },
      ],
    }).compile();

    service = module.get<PositiveNoteService>(PositiveNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all community note', async () => {
    const mockResult = [
      {
        id: 'note-1',
        email: 'user1@example.com',
        line1: 'First note',
        line2: null,
        line3: null,
        imageUrls: ['https://example.com/img1.png'],
        mood: 'happy' as Mood,
        showMessage: true,
        isDelete: false,
        createdAt: new Date(),
        userId: 'user-1',
        user: {
          id: 'user-1',
          name: 'Alice',
          email: 'user1@example.com',
          avatarUrl: 'https://example.com/avatar1.png',
        },
      },
    ];
    
    mockRepository.getAllNotesCommunity = jest.fn().mockResolvedValue(mockResult);
    const result = await service.getAllCommunityNote();
    
    expect(result).toEqual(mockResult);
    expect(mockRepository.getAllNotesCommunity).toHaveBeenCalledTimes(1);
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
      imageUrls: ['https://example.com/img1.png', 'https://example.com/img2.png'],
      mood: 'happy',
      showMessage: false,
      isDelete: false,
      createdAt: new Date(),
      userId: null,
    };

    mockRepository.createPositiveNote = jest.fn().mockResolvedValue(mockResult);

    const result = await service.createPositiveNote(positiveNoteDto, 'access-token');

    expect(result).toEqual(mockResult);
    expect(mockRepository.createPositiveNote).toHaveBeenCalledWith(positiveNoteDto);
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

    const result = await service.createPositiveNote(dto, 'access-token');

    expect(result).toEqual(expected);
  });

  it('should get all note by userId', async () => {
    const mockNotes: getAllNoteSendById[] = [
      {
        id: 'note-1',
        email: 'john.doe@example.com',
        line1: 'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ',
        imageUrls: ['https://via.placeholder.com/400x300?text=Park+View'],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:30:00Z'),
      },
    ];
    
    mockRepository.getAllNoteById = jest.fn().mockResolvedValue(mockNotes);
    const result = await service.getAllNoteByUserId('user-1');
    
    expect(result.data.mapResult).toEqual(mockNotes);
    expect(result.data.countNote).toBe(mockNotes.length);
    expect(mockRepository.getAllNoteById).toHaveBeenCalledWith('user-1');
  });

  it('should be get recent note post by userId', async () => {
    const mockUserId = 'mock-user1';
    const mockResult: getAllNoteSendById = {
      id: 'note-1',
      email: 'john.doe@example.com',
      line1: 'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ',
      imageUrls: ['https://via.placeholder.com/400x300?text=Park+View'],
      mood: Mood.happy,
      createdAt: new Date('2025-08-09T10:30:00Z'),
    };
    
    mockRepository.recentNoteByUserId = jest.fn().mockResolvedValue(mockResult);
    const result = await service.recentNoteByUserId(mockUserId);
    
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledWith(mockUserId);
  });

  it('should be get all note by userId not include recent note', async () => {
    const mockUserId = 'user-id-1';
    const mockAllNote = [
      {
        id: 'note-1',
        email: 'john1.doe@example.com',
        line1: 'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ',
        imageUrls: ['https://via.placeholder.com/400x300?text=Park+View'],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:35:00Z'),
      },
    ];
    
    mockRepository.getAllpositiveNotesWithoutLatest = jest.fn().mockResolvedValue(mockAllNote);

    const result = await service.getAllpositiveNotesWithoutLatest(mockUserId);
    
    expect(mockRepository.getAllpositiveNotesWithoutLatest).toHaveBeenCalledTimes(1);
    expect(mockRepository.getAllpositiveNotesWithoutLatest).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual(mockAllNote);
  });
});
