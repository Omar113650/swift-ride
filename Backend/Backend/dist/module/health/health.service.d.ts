import { HealthCheckService, HealthIndicatorResult } from '@nestjs/terminus';
import { PrismaService } from '../../core/prisma/prisma.service';
import Redis from 'ioredis';
export declare class HealthService {
    private health;
    private prisma;
    private redis;
    constructor(health: HealthCheckService, prisma: PrismaService, redis: Redis);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult, Partial<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult> | undefined, Partial<HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & HealthIndicatorResult> | undefined>>;
    private checkDatabase;
    private checkRedis;
}
