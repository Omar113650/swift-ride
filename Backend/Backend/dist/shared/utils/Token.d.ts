import { JwtService } from '@nestjs/jwt';
type JwtUser = {
    id: string;
    role: string;
    rideId?: string;
};
export declare const generateTokens: (jwtService: JwtService, user: JwtUser) => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export {};
