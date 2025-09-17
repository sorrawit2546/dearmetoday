import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { downloadAvatar } from '../../positive-note/utils/download-avatar';
import { GoogleUser } from '../entity/auth.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    const callbackURL = `${process.env.SERVER_URL}/api/auth/google/callback`;
    console.log('GoogleStrategy: SERVER_URL =', process.env.SERVER_URL);
    console.log('GoogleStrategy: Callback URL =', callbackURL);

    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/calendar.events',
        'https://www.googleapis.com/auth/calendar.readonly',
      ],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<GoogleUser> {
    try {
      const googleAvatar = profile.photos?.[0]?.value ?? '';
      const localAvatarPath = await downloadAvatar(googleAvatar, profile.id);

      return {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatarUrl: localAvatarPath
          ? `${process.env.SERVER_URL}${localAvatarPath}`
          : googleAvatar,
        provider: 'google',
        accessToken,
      };
    } catch (error) {
      console.error('Error in Google strategy validate:', error);
      // Return with original Google avatar if download fails
      return {
        id: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        avatarUrl: profile.photos?.[0]?.value ?? '',
        provider: 'google',
        accessToken,
      };
    }
  }
}
