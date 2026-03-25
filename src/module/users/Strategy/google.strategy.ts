// /   واكلمه دي اللي هيا اعمل انترجيسن مع جوجل

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile } from 'passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.Call_Back_URL,
      //   الداتا اللي عاوز جوجل تبعتهالك
      scope: ['email', 'profile'],
    });
  }

  //     اسمخها فلديت عشان تبعتلي الداتا بتاعتي  لازم اعمل الفنكشن دي واخليها asyn
  // دي الفنكشن اللي جوجل بتبعت فيها الاكسس توكن والريفيش توكن

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      accessToken,
      refreshToken,
      profile,
    };

    return user;
  }
}
