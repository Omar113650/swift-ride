import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import Redis from 'ioredis';


@Injectable()
export class HealthService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS')
    private redis: Redis,
  ) {}

  async check() {
    const dbStatus = await this.checkDB();
    const redisStatus = await this.checkRedis();

    return {
      status: dbStatus && redisStatus ? 'ok' : 'degraded',
      services: {
        database: dbStatus ? 'up' : 'down',
        redis: redisStatus ? 'up' : 'down',
      },
      timestamp: new Date(),
    };
  }

  private async checkDB(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redis.ping();
      return true;
    } catch {
      return false;
    }
  }


}

