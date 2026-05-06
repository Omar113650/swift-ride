import { VerifyCallback } from 'passport-google-oauth20';
import { Profile } from 'passport';
declare const GoogleStrategy_base: new (...args: any) => any;
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor();
    validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any>;
}
export {};
