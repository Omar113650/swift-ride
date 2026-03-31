






import { JwtService } from '@nestjs/jwt';

type JwtUser = {
  id: string;
  role: string;
  rideId?: string;
};

export const generateTokens = async (
  jwtService: JwtService,
  user: JwtUser,
) => {
  const payload = {
    sub: user.id,
    role: user.role,
    rideId: user.rideId,
  };

  const [accessToken, refreshToken] = await Promise.all([
    jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    }),
    jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    }),
  ]);

  return {
    accessToken,
    refreshToken,
  };
};
