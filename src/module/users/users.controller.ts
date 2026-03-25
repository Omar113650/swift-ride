import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UserService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login-user.dto';
import type { Response, Request } from 'express';
import { Strategy } from 'passport-local';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';

@ApiTags('authentication')
@Controller({ version: '1', path: 'auth' })
@Controller('api/auth')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  // دي عشان execlude  اللي حاططها ف الداتا بيز تشتغل
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Register new user with OTP verification' })
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.Register(body, res);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user and set authentication cookies' })
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return await this.userService.login(body, res);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user and clear cookies' })
  async logout(@Res({ passthrough: true }) res: Response) {
    return await this.userService.logout(res);
  }

  @Get('found-user')
  async findUser() {
    return await this.userService.GetProfile();
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.RefreshToken;
    return await this.userService.refreshToken(refreshToken, res);
  }

  // http://localhost:3000/api/auth/google/login

  // دي اول ايندبوينت اللي المستخدم يكلم بيها السيرفر
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  // ابفنكشن دي يعتبر ملهاش لازمه بس لازم اعملها
  googleLogin() {
    return 'hello';
  }

  //  دي تاني ايند بوينت اللي السيرفر يكلم بيها جوجل وجول يرجعلي الداتا

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  // ابفنكشن دي يعتبر ملهاش لازمه بس لازم اعملها
  googleCallback() {
    //يعني ده الشكل اللي بيطلع بعد ما اسجل  ف جوجل
    return 'user login....';
  }

  //  د عشان تشوف الداتا اللي هو استخدمها وطلعها عنك ف بتاخد منها اللي انت عاوزه وتخزنها ف الداتا بيز
  // googleCallback(@Req() req:any){
  //   const user = req.user
  //   //يعني ده الشكل اللي بيطلع بعد ما اسجل  ف جوجل
  //   return user
  // }
}
