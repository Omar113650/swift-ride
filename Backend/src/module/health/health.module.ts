// import { Module } from '@nestjs/common';
// import { HealthController } from './health.controller';
// import { HealthService } from './health.service';

// @Module({
//   controllers: [HealthController],
//   providers: [HealthService],
// })
// export class HealthModule {}





import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { PrismaService } from '../../core/prisma/prisma.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
})
export class HealthModule {}
