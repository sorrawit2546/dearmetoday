import { Test, TestingModule } from '@nestjs/testing';
import { Entry, Mood } from '@prisma/client';
import { CalendarService } from '../calendar/calendar.service';
import { SendgridService } from '../third-party/sendgrid/sendgrid.service';
import {
  UpdatePositiveNoteDeleteDto,
  UpdatePositiveNoteDto,
} from './Dto/create-positive-note';
import {
  getAllNoteSendById,
  IpositiveNoteByNoteId,
} from './entity/positive-note.entity';
import { PositiveNoteRepository } from './positive-note.repository';
import { PositiveNoteService } from './positive-note.service';
import { SummaryGateway } from '../summary/summary.gateway';
import { ResendService } from '../third-party/resend/resend.service';

describe('PositiveNoteService', () => {
  let service: PositiveNoteService;

  const mockRepository = {
    createPositiveNote: jest.fn(),
    getAllNoteById: jest.fn(),
    recentNoteByUserId: jest.fn(),
    getAllpositiveNotesWithoutLatest: jest.fn(),
    getAllNotesCommunity: jest.fn(),
    getPositiveNoteById: jest.fn(),
    editPositiveNoteById: jest.fn<Promise<Entry>, [string, string, any]>(),
    deletePositiveNoteById: jest.fn(),
    getAllPositiveNoteInDearme: jest.fn(),
  };

  const mockSendgridService = {
    sendPositiveNoteEmail: jest.fn().mockResolvedValue(undefined),
  };

  const mockCalendarService = {
    addEvent: jest.fn().mockResolvedValue(undefined),
  };

  const mockResendService = {
    addEvent: jest.fn().mockResolvedValue(undefined),
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
        {
          provide: SummaryGateway,
          useValue: {},
        },
        {
          provide: ResendService,
          useValue: mockResendService,
        },
      ],
    }).compile();

    service = module.get<PositiveNoteService>(PositiveNoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Count Positive Note', () => {
    it('Should Count Collect Positive Note in Dearme Today', async () => {
      const mockResponse = 21;
      mockRepository.getAllPositiveNoteInDearme = jest
        .fn()
        .mockResolvedValue(mockResponse);
      const result = await service.getAllPositiveNoteInDearme();
      expect(result).toBe(mockResponse);
      expect(mockRepository.getAllPositiveNoteInDearme).toHaveBeenCalledTimes(
        1,
      );
    });
  });

  describe('Delete Positive Note', () => {
    it('should delete positive note (softdelete)', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';
      const mockDto: UpdatePositiveNoteDeleteDto = { isDelete: true };
      const mockResponse = 'Positive Note is Deleted!';
      mockRepository.deletePositiveNoteById = jest
        .fn()
        .mockResolvedValue(mockResponse);

      const result = await service.deletePositiveNoteById(
        noteId,
        userId,
        mockDto,
      );
      expect(result).toEqual(mockResponse);
      expect(mockRepository.deletePositiveNoteById).toHaveBeenCalledTimes(1);
      expect(mockRepository.deletePositiveNoteById).toHaveBeenCalledWith(
        noteId,
        userId,
        mockDto,
      );
    });
  });

  describe('Edit Positive Note', () => {
    it('should edit positive note without images', async () => {
      const noteId = 'note-1';
      const userId = 'user-1';

      const mockPositiveDto: UpdatePositiveNoteDto = {
        line1: 'Updated line1 content',
        line3: 'Additional thoughts here',
        imageUrls: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ],
        mood: Mood.happy,
        showMessage: true,
      };

      const mockResultData: IpositiveNoteByNoteId = {
        id: 'note-1',
        email: 'test@example.com',
        line1: 'Updated line1 content',
        line2: null,
        line3: 'Additional thoughts here',
        imageUrls: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg',
        ],
        mood: Mood.happy,
        showMessage: true,
        moodScore: 2,
        isDelete: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 'user-1',
      };
      mockRepository.editPositiveNoteById = jest
        .fn<Promise<Entry>, [string, string, any]>()
        .mockResolvedValue(mockResultData as Entry);

      const result = await service.editPositiveNoteById(
        noteId,
        userId,
        mockPositiveDto,
      );
      expect(result).toEqual(mockResultData);
      expect(mockRepository.editPositiveNoteById).toHaveBeenCalledTimes(1);
    });
  });
  it('should get positivenote by note id', async () => {
    //data
    const noteId = 'note-1';
    const userId = 'user-1';

    const mockResultData: IpositiveNoteByNoteId = {
      id: 'user-1',
      email: 'sangmanee773@gmail.com',
      line1: 'ชอบท้องฟ้า',
      line2: 'แมวววว',
      line3: 'แมววววว',
      imageUrls: [
        'https://example.com/img2.png',
        'https://example.com/img3.png',
      ],
      mood: 'sad' as Mood,
      moodScore: 2,
      isDelete: false,
      showMessage: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'user-1',
    };

    mockRepository.getPositiveNoteById = jest
      .fn()
      .mockResolvedValue(mockResultData);

    const result = await service.getPositiveNoteById(noteId, userId);
    expect(result).toEqual(mockResultData);
    expect(mockRepository.getPositiveNoteById).toHaveBeenCalledWith(
      noteId,
      userId,
    );
    expect(mockRepository.getPositiveNoteById).toHaveBeenCalledTimes(1);
  });

  it('should get all community note', async () => {
    //Arrange
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
      {
        id: 'note-2',
        email: 'user2@example.com',
        line1: 'Second note',
        line2: null,
        line3: null,
        imageUrls: [
          'https://example.com/img2.png',
          'https://example.com/img3.png',
        ],
        mood: 'sad' as Mood,
        showMessage: true,
        isDelete: false,
        createdAt: new Date(),
        userId: 'user-2',
        user: {
          id: 'user-2',
          name: 'Bob',
          email: 'user2@example.com',
          avatarUrl: 'https://example.com/avatar2.png',
        },
      },
    ];
    //Act
    mockRepository.getAllNotesCommunity = jest
      .fn()
      .mockResolvedValue(mockResult);
    const result = await service.getAllCommunityNote();
    //Assert
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

    const result = await service.createPositiveNote(
      positiveNoteDto,
      'access-token',
    );

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

    const result = await service.createPositiveNote(dto, 'access-token');

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
        isDelete: false,
      },
      {
        id: 'note-2',
        email: 'jane.smith@example.com',
        line1: 'ฝนตกทั้งวัน เลยอยู่บ้านอ่านหนังสือ',
        imageUrls: ['https://via.placeholder.com/400x300?text=Rainy+Day'],
        mood: Mood.neutral,
        createdAt: new Date('2025-08-08T15:45:00Z'),
        isDelete: false,
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
        isDelete: false,
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
      isDelete: false,
    };
    //mock repository
    mockRepository.recentNoteByUserId = jest.fn().mockReturnValue(mockResult);
    const result = await service.recentNoteByUserId(mockUserId);
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResult);
    expect(mockRepository.recentNoteByUserId).toHaveBeenCalledWith(mockUserId);
  });

  it('should be get all note by userId not include recent note', async () => {
    const mockUserId = 'user-id-1';
    const mockRecentNote = {
      id: 'recent-id',
      email: 'john1.doe@example.com',
      line1:
        'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ ไปกินปิ้งย่างงงกานนนนนนนนนน',
      imageUrls: [
        'https://via.placeholder.com/400x300?text=Park+View',
        'https://via.placeholder.com/400x300?text=Sunset',
      ],
      mood: Mood.happy,
      createdAt: new Date('2025-08-09T10:30:00Z'),
    };
    const mockAllNote = [
      {
        id: 'note-1',
        email: 'john1.doe@example.com',
        line1:
          'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ ไปกินปิ้งย่างงงกานนนนนนนนนน',
        imageUrls: [
          'https://via.placeholder.com/400x300?text=Park+View',
          'https://via.placeholder.com/400x300?text=Sunset',
        ],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:35:00Z'),
      },
      {
        id: 'note-2',
        email: 'john2.doe@example.com',
        line1:
          'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ ไปกินปิ้งย่างงงกานนนนนนนนนน',
        imageUrls: [
          'https://via.placeholder.com/400x300?text=Park+View',
          'https://via.placeholder.com/400x300?text=Sunset',
        ],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:30:00Z'),
      },
      {
        id: 'note-3',
        email: 'john3.doe@example.com',
        line1:
          'วันนี้อากาศดีมาก ไปเดินเล่นสวนสาธารณะ ไปกินปิ้งย่างงงกานนนนนนนนนน',
        imageUrls: [
          'https://via.placeholder.com/400x300?text=Park+View',
          'https://via.placeholder.com/400x300?text=Sunset',
        ],
        mood: Mood.happy,
        createdAt: new Date('2025-08-09T10:29:00Z'),
      },
    ];
    mockRepository.getAllpositiveNotesWithoutLatest = jest
      .fn()
      .mockResolvedValue(mockAllNote);
    mockRepository.recentNoteByUserId = jest
      .fn()
      .mockReturnValue(mockRecentNote);

    //check
    const result = await service.getAllpositiveNotesWithoutLatest(mockUserId);
    expect(
      mockRepository.getAllpositiveNotesWithoutLatest,
    ).toHaveBeenCalledTimes(1);
    expect(
      mockRepository.getAllpositiveNotesWithoutLatest,
    ).toHaveBeenCalledWith(mockUserId);
    expect(result).toEqual(mockAllNote);
    //check ว่า result note ไม่มีอยู่ในผลลัพธ์
    const recentNoteId = result.map((note) => note.id);
    expect(recentNoteId).not.toContain('recent-id');
    // ตรวจสอบลำดับเวลา (ควรเรียงจากใหม่ไปเก่า)
    const dataDate = result.map((note) => note.createdAt);
    expect(dataDate[0] > dataDate[1]).toBeTruthy();
    expect(dataDate[1] > dataDate[2]).toBeTruthy();
    // ไม่ต้องตรวจสอบ dataDate[3] เพราะมีแค่ 3 รายการ
  });
});
