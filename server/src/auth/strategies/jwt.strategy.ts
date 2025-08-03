// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // เผื่อใช้ผ่าน header
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        (req) => req?.cookies?.access_token || null, // ✅ จาก cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'DEARMETODAT_SUPER_SECRET',
    });
  }

  validate(payload: any) {
    // payload ที่ decode มาจาก JWT
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
    };
  }
}
