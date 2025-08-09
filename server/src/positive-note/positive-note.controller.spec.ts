import { Test, TestingModule } from '@nestjs/testing';
import { Entry, Mood } from '@prisma/client'; // ปรับตาม enum จริงของคุณ
import type { Request as ExpressRequest } from 'express';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteService } from './positive-note.service';

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
});
