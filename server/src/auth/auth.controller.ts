import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleUser, User } from './entity/auth.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: GoogleUser | User;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @Post('google/mobile')
  async googleMobileLogin(@Req() req: Request, @Res() res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { access_token } = req.body;

      if (!access_token) {
        throw new UnauthorizedException('Missing access_token');
      }

      const result = await this.authService.loginWithGoogleMobile(access_token);

      return res.json({
        success: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (e) {
      console.error('[Google Mobile Login ERROR]', e);
      throw new UnauthorizedException('Google Mobile Login Failed');
    }
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    console.log('AuthController: Google login initiated');
    // ปล่อยให้ Passport ทำงาน
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      console.log('AuthController: Google callback received');
      console.log('AuthController: User from Google:', req.user);

      if (!req.user) {
        console.error('AuthController: No user data from Google');
        const frontendUrl =
          this.config.get<string>('FRONTEND_URL') || 'http://localhost:4200';
        return res.redirect(`${frontendUrl}/?error=auth_failed`);
      }

      const { accessToken } = await this.authService.loginWithGoogle(
        req.user as GoogleUser,
      );
      const googleAccessToken = (req.user as GoogleUser).accessToken;

      console.log(
        'AuthController: Access token generated:',
        accessToken ? 'Yes' : 'No',
      );

      if (!accessToken) {
        console.error('AuthController: Failed to generate access token');
        const frontendUrl =
          this.config.get<string>('FRONTEND_URL') || 'http://localhost:4200';
        return res.redirect(`${frontendUrl}/?error=token_generation_failed`);
      }

      // แก้ไข cookie configuration
      const frontendUrl =
        this.config.get<string>('FRONTEND_URL') || 'http://localhost:4200';
      const cookieDomain = this.config.get<string>('COOKIE_DOMAIN'); // e.g. localhost or your prod domain
      const cookieSecure = this.config.get<string>('COOKIE_SECURE') === 'true';
      const cookieSameSite = (this.config.get<string>('COOKIE_SAMESITE') ??
        'lax') as 'lax' | 'strict' | 'none';

      res.cookie('access_token', accessToken, {
        httpOnly: true,
        sameSite: cookieSameSite,
        secure: cookieSecure,
        path: '/',
        domain: cookieDomain,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      res.cookie('google_access_token', googleAccessToken, {
        httpOnly: true,
        sameSite: cookieSameSite,
        secure: cookieSecure,
        path: '/',
        domain: cookieDomain,
        maxAge: 60 * 60 * 1000, // 1 ชั่วโมง (เท่ากับอายุ access_token)
      });

      console.log('AuthController: Cookie set, redirecting to dashboard');
      res.redirect(`${frontendUrl}/dashboard`);
    } catch (error) {
      console.error('AuthController: Error in Google callback:', error);
      const frontendUrl =
        this.config.get<string>('FRONTEND_URL') || 'http://localhost:4200';
      res.redirect(`${frontendUrl}/?error=server_error`);
    }
  }

  @Post('logout')
  logout(@Res() res: Response) {
    console.log('AuthController: Logout requested');
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    console.log('AuthController: /me endpoint called');
    console.log('AuthController: User from JWT:', req.user);
    console.log('AuthController: Cookies:', req.cookies);
    console.log(
      'AuthController: Access token cookie:',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      req.cookies?.access_token ? 'Present' : 'Missing',
    );

    if (!req.user) {
      console.log(
        'AuthController: No user found, throwing UnauthorizedException',
      );
      throw new UnauthorizedException('User not found');
    }

    console.log('AuthController: Returning user data');
    return {
      success: true,
      user: req.user,
    };
  }
}
