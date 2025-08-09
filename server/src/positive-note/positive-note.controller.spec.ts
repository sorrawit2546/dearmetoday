import { Test, TestingModule } from '@nestjs/testing';
import { Entry, Mood } from '@prisma/client'; // ปรับตาม enum จริงของคุณ
import type { Request as ExpressRequest } from 'express';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteService } from './positive-note.service';
import { getAllNoteSendById } from './entity/positive-note.entity';

interface MinimalRequestLike {
  user?: unknown;
}

describe('PositiveNoteController', () => {
  let controller: PositiveNoteController;
  let mockService: PositiveNoteService;

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
            getAllPositiveNoteById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PositiveNoteController>(PositiveNoteController);
    mockService = module.get<PositiveNoteService>(PositiveNoteService);
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

  it('should get all PositiveNote By Id', async() => {
    // mock req object
    const mockReq: any = {
      cookies: {
        access_token: 'mock-token',
      },
    };
    // const mockUser = {
    //   userId: '123',
    //   name: 'sorrawit',
    //   email: 'sangmanee773@gmail.com',
    //   avatarUrl: 'image_1',
    // };
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
    mockService.getAllNoteByUserId = jest.fn().mockResolvedValue(mockNotes);
    const result = await controller.getAllpositiveNoteById(mockReq);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockService.getAllNoteByUserId).toHaveBeenCalledWith('mock-token');
    expect(result).toEqual(mockNotes);
  });
});
