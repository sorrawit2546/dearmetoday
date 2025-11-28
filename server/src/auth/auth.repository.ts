import { BadGatewayException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUser } from './entity/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByGoogleId(googleId: string): Promise<any> {
    try {
      return await this.prisma.user.findFirst({
        where: { googleId },
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadGatewayException();
    }
  }

  async createWithGoogle(googleUser: GoogleUser): Promise<any> {
    try {
      return await this.prisma.user.upsert({
        where: { id: googleUser.id }, // ใช้ id จาก Google OAuth เป็น primary key
        update: {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.avatarUrl,
          provider: googleUser.provider,
          googleId: googleUser.id,
        },
        create: {
          id: googleUser.id, // ต้องมีเสมอ เพราะ schema ไม่มี default(uuid())
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.avatarUrl,
          provider: googleUser.provider,
          googleId: googleUser.id,
        },
      });
    } catch (error) {
      // eslint-disable-next-line prettier/prettier
      console.error('❌ Failed to create/upsert user:', error);
      throw new BadGatewayException('Failed to create or update user');
    }
  }
}
