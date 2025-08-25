import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
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
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    console.log('AuthController: Google login initiated');
    // ปล่อยให้ Passport ทำงาน
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    console.log('AuthController: Google callback received');
    console.log('AuthController: User from Google:', req.user);

    const { accessToken } = await this.authService.loginWithGoogle(
      req.user as GoogleUser,
    );
    const googleAccessToken = (req.user as GoogleUser).accessToken;

    console.log(
      'AuthController: Access token generated:',
      accessToken ? 'Yes' : 'No',
    );

    // แก้ไข cookie configuration
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // ต้อง false สำหรับ localhost
      path: '/', // เพิ่ม path
      domain: 'localhost', // ระบุ domain
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 วัน
    });

    res.cookie('google_access_token', googleAccessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
      domain: 'localhost',
      maxAge: 60 * 60 * 1000, // 1 ชั่วโมง (เท่ากับอายุ access_token)
    });

    console.log('AuthController: Cookie set, redirecting to dashboard');
    res.redirect('http://localhost:4200/dashboard');
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
