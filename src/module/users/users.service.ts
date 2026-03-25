//  Basic Logger ده السريع
// private readonly logger = new Logger(UserService.name);
//   this.logger.log(`Finding user`);

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
// import { randomInt } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { generateTokens } from '../../shared/utils/Token';
import { setAuthCookies } from '../../shared/utils/setAuthCookies';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import { Response } from 'express';
// import { Logger } from '@nestjs/common';
// import { CustomLoggerService } from '../../common/logger/custom-logger.service';
@Injectable()
export class UserService {
  // private readonly logger = new Logger(UserService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    // private logger: CustomLoggerService,
  ) {}

  async Register(createUserDto: CreateUserDto, res: Response) {
    const existingEmail = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    console.log(existingEmail);

    if (existingEmail) {
      throw new BadRequestException('this email is already exist');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    const tokens = await generateTokens(this.jwtService, newUser);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    // this.logger.log(`Finding user`);

    return {
      message: 'Otp sent to email',
      tokens,
      user: newUser,
    };

    // await this.emailService.sendOtpEmail({
    //   to: createUserDto.email,
    //   otp,
    //   subject: 'Your OTP Code',
    // });
  }

  async login(loginDto: LoginDto, res: Response) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const tokens = await generateTokens(this.jwtService, user);
    setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

    const safeUser = plainToInstance(Object, user);

    return {
      user: safeUser,
      tokens,
    };
  }

  async logout(res: Response) {
    const isProd = process.env.NODE_ENV === 'production';

    res.clearCookie('AccessToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    res.clearCookie('RefreshToken', {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
    });

    return { message: 'Logged out successfully' };
  }

  async refreshToken(refreshToken: string, res: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    let decoded: any;

    try {
      decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { accessToken } = await generateTokens(this.jwtService, user);

    setAuthCookies(res, accessToken, refreshToken);

    return {
      message: 'Access token refreshed successfully',
      accessToken,
      user,
    };
  }

async GetProfile() {
  const users = await this.prisma.user.findMany();

  if (!users || users.length === 0) {
    throw new NotFoundException('No users found');
  }

  return users;
}
  }





