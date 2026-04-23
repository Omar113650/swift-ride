// import { Controller, Get } from '@nestjs/common';
// import { HealthService } from './health.service';

// @Controller('health')
// export class HealthController {
//   constructor(private readonly healthService: HealthService) {}

//   @Get()
//   async check() {
//     return this.healthService.check();
//   }
// }


import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check() {
    return this.healthService.check();
  }
}





// http://localhost:3000/api/v1/health