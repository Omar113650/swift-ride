import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secret =
          configService.get<string>('jwt.secret') || 'defaultSecretKey';

        const expiresIn = configService.get<string>('jwt.expiresIn') || '86400';

        return {
          secret,
          signOptions: { expiresIn: parseInt(expiresIn, 10) },
        };
      },
    }),
  ],

  controllers: [UserController],

  providers: [UserService, PrismaService],
})
export class UsersModule {}
