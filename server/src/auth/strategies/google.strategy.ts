import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleUser } from '../entity/auth.entity';
import { downloadAvatar } from '../../positive-note/utils/download-avatar';

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

  // eslint-disable-next-line @typescript-eslint/require-await
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<GoogleUser> {
    const googleAvatar = profile.photos?.[0]?.value ?? '';
    const localAvatarPath = await downloadAvatar(googleAvatar, profile.id);

    return {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      avatarUrl: `${process.env.SERVER_URL}${localAvatarPath}`,
      provider: 'google',
      accessToken,
    };
  }
}
