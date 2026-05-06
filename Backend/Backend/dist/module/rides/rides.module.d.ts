import { NestModule } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import 'dotenv/config';
export declare class RideModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void;
}
