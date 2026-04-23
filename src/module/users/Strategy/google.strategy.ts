import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback,StrategyOptions } from 'passport-google-oauth20';
import { Profile } from 'passport';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
 super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
      passReqToCallback: false, // ✅ إضافة هذا السطر
    } as StrategyOptions);
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
        accessToken, 
        refreshToken, 
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
