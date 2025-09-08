// auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IJwtPayload } from './entitry/jwt.entitry';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(), // เผื่อใช้ผ่าน header

        (req) => {
          console.log('JWT Strategy: Extracting token from cookie');
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          console.log('JWT Strategy: Cookies:', req?.cookies);
          console.log(
            'JWT Strategy: Access token:',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            req?.cookies?.access_token ? 'Present' : 'Missing',
          );
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
          return req?.cookies?.access_token || null; // ✅ จาก cookie
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'DEARMETODAT_SUPER_SECRET',
    });
  }

  validate(payload: IJwtPayload) {
    console.log('JWT Strategy: Validating payload:', payload);
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.avatarUrl,
    };
  }
}
