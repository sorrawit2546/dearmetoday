import { Test, TestingModule } from '@nestjs/testing';
import { PositiveNoteController } from './positive-note.controller';
import { PositiveNoteService } from './positive-note.service';
import { CreatePositiveNoteDto } from './Dto/create-positive-note';
import { Mood } from '@prisma/client'; // ปรับตาม enum จริงของคุณ
import { Entry } from '@prisma/client';

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
    const createDto: CreatePositiveNoteDto = {
      line1: 'Test Positive note',
      line2: null,
      line3: null,
      email: 'sangmanee773@gmail.com',
      mood: Mood.happy,
      imageUrls: [
        'https://example.com/img1.png',
        'https://example.com/img2.png',
      ],
    };

    const result = await controller.createPositiveNote(createDto);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockService.createPositiveNote).toHaveBeenCalledWith(createDto);
    expect(result).toEqual(mockResult);
  });
});
