import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './auth.repository';
import { GoogleUser, User } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private jwtService: JwtService,
  ) {}

  async loginWithGoogleMobile(accessToken: string) {
    // 1. ดึงข้อมูลโปรไฟล์จาก Google
    const profile = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`,
    ).then((res) => res.json());

    if (!profile || !profile.id || !profile.email) {
      throw new UnauthorizedException('Invalid Google token');
    }

    // 2. หา user จาก DB ตาม googleId
    let user = await this.authRepo.findUserByGoogleId(profile.id);

    // 3. ถ้าไม่มีก็สมัครใหม่
    if (!user) {
      user = await this.authRepo.createWithGoogle({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        avatarUrl: profile.picture,
        provider: 'google',
      });
    }

    // 4. ออก JWT
    const jwt = this.jwtService.sign({
      sub: (user as User).id,
      name: (user as User).name,
      email: (user as User).email,
      avatarUrl: (user as User).avatarUrl,
    });

    return {
      accessToken: jwt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      user,
    };
  }

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
