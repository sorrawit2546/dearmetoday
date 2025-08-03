import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
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
  async googleLogin() {
    // ปล่อยให้ Passport ทำงาน
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: RequestWithUser, @Res() res: Response) {
    const { accessToken } = await this.authService.loginWithGoogle(
      req.user as GoogleUser,
    );
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax', // หรือ 'strict' ก็ได้ใน local
      secure: false, // ต้อง false สำหรับ localhost (ถ้าใส่ true แล้วไม่ได้ใช้ HTTPS = cookie ไม่ถูกส่ง)
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.redirect('http://localhost:4200/dashboard');
  }

  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('access_token');
    res.status(200).json({ message: 'Logged out' });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    console.log('User from JWT:', req.user);
    return {
      success: true,
      user: req.user,
    };
  }
}
