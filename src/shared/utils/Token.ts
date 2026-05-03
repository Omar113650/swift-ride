


import { JwtService } from '@nestjs/jwt';

type JwtUser = {
  id: string;
  role: string;
  rideId?: string;
};

export const generateTokens = async (
  jwtService: JwtService,
  user: JwtUser
) => {
  const payload = {
    sub: user.id,
    role: user.role,
    rideId: user.rideId,
  };

  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
    }as any),

    jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    }as any),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};