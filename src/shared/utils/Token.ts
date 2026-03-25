// import { JwtService } from "@nestjs/jwt";
// import { User } from '../../modules/users/entities/user.entities';

// export const generateTokens = async (
//   jwtService: JwtService,
//   user: User,
// ) => {
//   const payload = { sub: user.id, role: user.role , tenantId: user.tenant};

//   const [accessToken, refreshToken] = await Promise.all([
//     jwtService.signAsync(payload, {
//       secret: process.env.JWT_ACCESS_SECRET,
//       expiresIn: '15m',
//     }),
//     jwtService.signAsync(payload, { 
//       secret: process.env.JWT_REFRESH_SECRET,
//       expiresIn: '7d',
//     }),
//   ]);

//   return {
//     accessToken, 
//     refreshToken,
//   };
// };

















import { JwtService } from '@nestjs/jwt';

type JwtUser = {
  id: string;
  role: string;
  tenantId?: string;
};

export const generateTokens = async (
  jwtService: JwtService,
  user: JwtUser,
) => {
  const payload = {
    sub: user.id,
    role: user.role,
    tenantId: user.tenantId,
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
