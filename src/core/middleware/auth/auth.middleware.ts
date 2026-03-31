import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('🔥 AUTH HIT');
      const authHeader = req.headers['authorization'];
      console.log('HEADER:', authHeader);
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log('❌ NO TOKEN');
        return res.status(HttpStatus.UNAUTHORIZED).json({
          message: 'Unauthorized access',
        });
      }
      const token = authHeader?.split(' ')[1];
      console.log('TOKEN:', token);
      const payload = await this.jwtService.verifyAsync(token);
      console.log('PAYLOAD:', payload);

      req['User'] = payload;
      next();
    } catch (error) {
      console.log('❌ JWT ERROR:', error.message);
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized access',
      });
    }
  }
}
