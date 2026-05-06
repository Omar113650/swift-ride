// import { Inject, Injectable } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import Redis from 'ioredis';


// @Injectable()
// export class HealthService {
//   constructor(
//     private prisma: PrismaService,
//     @Inject('REDIS')
//     private redis: Redis,
//   ) {}

//   async check() {
//     const dbStatus = await this.checkDB();
//     const redisStatus = await this.checkRedis();

//     return {
//       status: dbStatus && redisStatus ? 'ok' : 'degraded',
//       services: {
//         database: dbStatus ? 'up' : 'down',
//         redis: redisStatus ? 'up' : 'down',
//       },
//       timestamp: new Date(),
//     };
//   }

//   private async checkDB(): Promise<boolean> {
//     try {
//       await this.prisma.$queryRaw`SELECT 1`;
//       return true;
//     } catch {
//       return false;
//     }
//   }

//   private async checkRedis(): Promise<boolean> {
//     try {
//       await this.redis.ping();
//       return true;
//     } catch {
//       return false;
//     }
//   }


// }






//use  terminus module






import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthIndicatorResult,
} from '@nestjs/terminus';
import { PrismaService } from '../../core/prisma/prisma.service';
import { Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaService,
    @Inject('REDIS')
    private redis: Redis,
  ) {}

  @HealthCheck()
  async check() {
    return this.health.check([
      () => this.checkDatabase(),
      () => this.checkRedis(),
    ]);
  }

  private async checkDatabase(): Promise<HealthIndicatorResult> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        database: {
          status: 'up',
        },
      };
    } catch (e) {
      return {
        database: {
          status: 'down',
        },
      };
    }
  }

  private async checkRedis(): Promise<HealthIndicatorResult> {
    try {
      await this.redis.ping();

      return {
        redis: {
          status: 'up',
        },
      };
    } catch (e) {
      return {
        redis: {
          status: 'down',
        },
      };
    }
  }
}

