import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoogleUser } from './entity/auth.entity';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async findUserByGoogleId(googleId: string): Promise<any> {
    try {
      const resultUser = await this.prisma.user.findFirst({
        where: {
          googleId: googleId,
        },
      });
      return resultUser;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(['BadRequestException']);
      }
      throw new BadGatewayException();
    }
  }

  async createWithGoogle(googleUser: GoogleUser): Promise<any> {
    return await this.prisma.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        avatarUrl: googleUser.avatar,
        provider: googleUser.provider,
        googleId: googleUser.id,
      },
    });
  }
}
