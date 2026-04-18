import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new Error('Google authentication failed');
    }
    return user;
  }
}