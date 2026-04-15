import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID:
        '796997064166-3mjj99u8r2koiispch2cl15ur2d37uis.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3000/api/v1/auth/google/callback',
      //   الداتا اللي عاوز جوجل تبعتهالك
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const user = {
        googleId: profile.id,
        email: profile.emails?.[0]?.value,
        name: profile.displayName,
        accessToken, // (اختياري - مش هيتخزن في DB غالبًا)
        refreshToken, // (اختياري),
        // profile
      };

      //     اسمخها فلديت عشان تبعتلي الداتا بتاعتي  لازم اعمل الفنكشن دي واخليها asyn
      // دي الفنكشن اللي جوجل بتبعت فيها الاكسس توكن والريفيش توكن
      // مهم جدًا: ده اللي بيخلي req.user يشتغل صح
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }
}
