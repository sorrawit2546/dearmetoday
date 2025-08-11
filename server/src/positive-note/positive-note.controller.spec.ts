import { Test, TestingModule } from '@nestjs/testing';
import { Entry, Mood } from '@prisma/client'; // ปรับตาม enum จริงของคุณ
import type { Request as ExpressRequest } from 'express';
import * as jwt from 'jsonwebtoken';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { getAllNoteSendById } from './entity/positive-note.entity';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteService } from './positive-note.service';

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
          },
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

    const req: MinimalRequestLike = { user: undefined };

    const createPositiveNoteSpy = jest.spyOn(mockService, 'createPositiveNote');

    // Act
    const result = await controller.createPositiveNote(
      files,
      createDto,
      req as unknown as ExpressRequest,
    );

    // Assert
    const expectedImageUrls = [
      'http://localhost:3000/uploads/img1.jpg',
      'http://localhost:3000/uploads/img2.jpg',
    ];

    expect(createPositiveNoteSpy).toHaveBeenCalledWith({
      ...createDto,
      email: 'sangmanee773@gmail.com',
      imageUrls: expectedImageUrls,
      showMessage: false,
    });
    expect(result).toEqual(mockResult);
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
});
