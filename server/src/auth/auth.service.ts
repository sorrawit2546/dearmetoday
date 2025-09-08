import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { GoogleUser, User } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async loginWithGoogle(
    googleUser: GoogleUser,
  ): Promise<{ accessToken: string; user: User }> {
    // 1. ตรวจว่าผู้ใช้นี้เคย login หรือยัง
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    let user = await this.authRepo.findUserByGoogleId(googleUser.id);
    // 2. ถ้าไม่เคย ก็สร้างใหม่
    if (!user) {
      user = (await this.authRepo.createWithGoogle(
        googleUser,
      )) as unknown as User;
    }
    // 3. สร้าง JWT
    const accessToken = this.jwtService.sign({
      sub: (user as User).id,
      name: (user as User).name,
      email: (user as User).email,
      avatarUrl: (user as User).avatarUrl,
    });

    return { accessToken, user: user as User };
  }
}
