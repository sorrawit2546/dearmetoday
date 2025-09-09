import { Test, TestingModule } from '@nestjs/testing';
import { Entry, Mood } from '@prisma/client'; // ปรับตาม enum จริงของคุณ
import type { Request as ExpressRequest } from 'express';
import * as jwt from 'jsonwebtoken';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteService } from './positive-note.service';
import { CalendarService } from '../calendar/calendar.service';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

interface MinimalRequestLike {
  user?: unknown;
  cookies?: Record<string, string>;
}

describe('PositiveNoteController', () => {
  let controller: PositiveNoteController;
  let mockService: jest.Mocked<PositiveNoteService>;

  const mockResult: Entry = {
    id: 'uuid-1234',
    email: 'sangmanee773@gmail.com',
    line1: 'Test Positive note',
    line2: null,
    line3: null,
    imageUrls: ['https://example.com/img1.png', 'https://example.com/img2.png'],
    mood: Mood.happy,
    moodScore: 2,
    showMessage: false,
    isDelete: false,
    createdAt: new Date(),
    userId: null,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositiveNoteController],
      providers: [
        {
          provide: PositiveNoteService,
          useValue: {
            createPositiveNote: jest.fn().mockResolvedValue(mockResult),
            getAllNoteByUserId: jest.fn(),
            recentNoteByUserId: jest.fn(),
            getAllpositiveNotesWithoutLatest: jest.fn(),
            getAllCommunityNote: jest.fn(),
          },
        },
        {
          provide: CalendarService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<PositiveNoteController>(PositiveNoteController);
    mockService = module.get(PositiveNoteService);

    // reset mocks each test
    (jwt.verify as jest.Mock).mockReset();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
    mockService.getAllCommunityNote = jest.fn().mockReturnValue(mockResult);
    const result = await controller.getAllCommunityNote();
    //Assert
    expect(result).toEqual(mockResult);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockService.getAllCommunityNote).toHaveBeenCalledTimes(1);
  });

  it('should create a positive note and return it', async () => {
    // Arrange
    const createDto: CreatePositiveNoteDto = {
      line1: 'Test Positive note',
      line2: null,
      line3: null,
      email: 'sangmanee773@gmail.com',
      mood: Mood.happy,
      imageUrls: [], // will be replaced by controller from files
    };

    const files = [
      { filename: 'img1.jpg' } as Express.Multer.File,
      { filename: 'img2.jpg' } as Express.Multer.File,
    ];

    // const createPositiveNoteSpy = jest.spyOn(mockService, 'createPositiveNote');

    const req: MinimalRequestLike = { user: undefined };
    // Act
    const result = await controller.createPositiveNote(
      files,
      createDto,
      req as unknown as ExpressRequest,
    );

    // Assert
    const expectedImageUrls = [
      'https://example.com/img1.png',
      'https://example.com/img2.png',
    ];

    expect(result).toEqual({
      id: 'uuid-1234',
      ...createDto,
      email: 'sangmanee773@gmail.com',
      imageUrls: expectedImageUrls,
      isDelete: false,
      moodScore: 2,
      showMessage: false,
      userId: null,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      createdAt: expect.any(Date),
    });
  });

  it('should get all PositiveNote By Id with wrapped data', async () => {
    const mockReq: MinimalRequestLike = {
      cookies: {
        access_token: 'mock-token',
      },
    };

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
    ];

    const getAllSpy = jest
      .spyOn(mockService, 'getAllNoteByUserId')
      .mockResolvedValue({
        data: { mapResult: mockNotes, countNote: mockNotes.length },
      });

    // Mock jwt.verify ให้คืนค่า payload ที่ต้องการ
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

    const result = await controller.getAllpositiveNoteById(
      mockReq as unknown as ExpressRequest,
    );

    expect(getAllSpy).toHaveBeenCalledWith('user-123');
    expect(result).toEqual({
      data: { mapResult: mockNotes, countNote: mockNotes.length },
    });
  });

  it('should get recent note By Id', async () => {
    //arrange
    const mockReq: MinimalRequestLike = {
      cookies: {
        access_token: 'mock-token',
      },
    };
    const mockRecentNote: getAllNoteSendById = {
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
    const getAllSpy = jest
      .spyOn(mockService, 'recentNoteByUserId')
      .mockResolvedValue(mockRecentNote);
    // Mock jwt.verify ให้คืนค่า payload ที่ต้องการ
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

    const result = await controller.recentNote(
      mockReq as unknown as ExpressRequest,
    );
    expect(getAllSpy).toHaveBeenCalledWith('user-123');
    expect(result).toEqual(mockRecentNote);
  });

  it('should be get all note by userId not include recent note', async () => {
    const mockReq: MinimalRequestLike = {
      cookies: {
        access_token: 'mock-token',
      },
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
    // Mock jwt.verify
    (jwt.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });

    // Mock service
    mockService.getAllpositiveNotesWithoutLatest = jest
      .fn()
      .mockResolvedValue(mockAllNote);

    const result = await controller.getAllpositiveNotesWithoutLatest(
      mockReq as unknown as ExpressRequest,
    );

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockService.getAllpositiveNotesWithoutLatest).toHaveBeenCalledWith(
      'user-123',
    );
    expect(result).toEqual(mockAllNote);

    // ตรวจสอบว่า recent note ไม่อยู่ในผลลัพธ์
    const resultIds = result.map((note) => note.id);
    expect(resultIds).not.toContain('recent-note-id');
  });
});
