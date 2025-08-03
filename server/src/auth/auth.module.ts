import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, GoogleStrategy, JwtStrategy],
  imports: [
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'DEARMETODAT_SUPER_SECRET',
      signOptions: { expiresIn: '7d' },
    }),
    // อื่น ๆ เช่น PassportModule
  ],
})
export class AuthModule {}
