import { Injectable } from '@nestjs/common';
import { ThankMessage } from '@prisma/client';
// import { ThankMessage } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { quickNoteDto } from './Dto/quick-note.dto';

@Injectable()
export class QuickNoteRepository {
  constructor(private prisma: PrismaService) {}
  async createQuickNote(
    user_id: string | null,
    quicknoteDto: quickNoteDto,
  ): Promise<ThankMessage> {
    console.log(user_id);
    if (user_id) {
      console.log(user_id);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...dtoWithoutUserId } = quicknoteDto;
      return this.prisma.thankMessage.create({
        data: {
          ...dtoWithoutUserId,
          user: { connect: { id: user_id } },
        },
      });
    } else {
      return this.prisma.thankMessage.create({
        data: {
          ...quicknoteDto,
        },
      });
    }
  }

  async getQuickNote(userId: string): Promise<ThankMessage[]> {
    return this.prisma.thankMessage.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
