// import {
//   Body,
//   Controller,
//   Param,
//   Patch,
//   Post,
//   Get,
//   UseGuards,
//   Req,
// } from '@nestjs/common';
// import { ApiTags, ApiOperation } from '@nestjs/swagger';
// import { RideService } from './rides.service';
// import { CreateRideDto } from './dto/create-ride.dto';

// // import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
// import { Roles } from '../../core/decorators/roles.decorator';
// import { RolesGuard } from '../../core/guards/roles.guard';
// // import{RidesService} from '../../core/redis/ride.gateway'

// @ApiTags('Rides')
// @Controller('rides')
// export class RideController {
//   constructor(
//     private readonly rideService: RideService,
//     // private readonly Rides: RidesService


//   ) {}

//   @Post('add-ride')
//   @ApiOperation({ summary: 'Create a new ride' })
//   @UseGuards(RolesGuard)
//   @Roles('RIDER', 'DRIVER', 'ADMIN')
//   async createRide(
//     @Req() req,
//     @Body() dto: CreateRideDto,
//     // مفترض تجيب الـ riderId من Auth
//   ) {
//     return this.rideService.createRide(req.User.sub, dto);
//   }

//   @Patch(':rideId/assign/:driverId')
//   @ApiOperation({ summary: 'Assign a driver to a ride' })
//   async assignDriver(
//     @Param('rideId') rideId: string,
//     @Param('driverId') driverId: string,
//   ) {
//     return this.rideService.assignDriver(rideId, driverId);
//   }

//   @Patch(':rideId/start')
//   @ApiOperation({ summary: 'Start a ride' })
//   async startRide(@Param('rideId') rideId: string) {
//     return this.rideService.startRide(rideId);
//   }

//   @Patch(':rideId/complete')
//   @ApiOperation({ summary: 'Complete a ride' })
//   async completeRide(
//     @Param('rideId') rideId: string,
//     @Body('distance') distance: number, // المسافة النهائية (كم)
//   ) {
//     return this.rideService.completeRide(rideId, distance);
//   }

//   @Patch(':rideId/cancel')
//   @ApiOperation({ summary: 'Cancel a ride' })
//   async cancelRide(
//     @Param('rideId') rideId: string,
//     @Body('cancelledBy') cancelledBy: 'rider' | 'driver',
//   ) {
//     return this.rideService.cancelRide(rideId, cancelledBy);
//   }

//   @Post(':rideId/route')
//   @ApiOperation({ summary: 'Add route history for real-time tracking' })
//   async addRouteHistory(
//     @Param('rideId') rideId: string,
//     @Body('lat') lat: number,
//     @Body('lng') lng: number,
//   ) {
//     return this.rideService.addRouteHistory(rideId, lat, lng);
//   }

//   @Get(':rideId')
//   @ApiOperation({ summary: 'Get ride details' })
//   async getRide(@Param('rideId') rideId: string) {
//     return this.rideService.getRide(rideId);
//   }









// // @Get(':rideId/route')
// // getRoute(@Param('rideId') rideId: string) {
// //   return this.Rides.getRideRoute(rideId);
// // }




// }



























import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';

import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RideService } from './rides.service';
import { CreateRideDto } from './dto/create-ride.dto';

import { RideTrackingService } from './ride-tracking.service';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@ApiTags('Rides')
@Controller('rides')
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly tracking: RideTrackingService,
  ) {}

  // 🚗 create ride
  @Post('add-ride')
  @ApiOperation({ summary: 'Create a new ride' })
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createRide(@Req() req, @Body() dto: CreateRideDto) {
    return this.rideService.createRide(req.User.sub, dto);
  }





  // 🚕 assign driver
  @Patch(':rideId/assign/:driverId')
  async assignDriver(
    @Param('rideId') rideId: string,
    @Param('driverId') driverId: string,
  ) {
    return this.rideService.assignDriver(rideId, driverId);
  }








  // 🚦 start ride
  @Patch(':rideId/start')
  async startRide(@Param('rideId') rideId: string) {
    return this.rideService.startRide(rideId);
  }







  // 🏁 complete ride
  @Patch(':rideId/complete')
  async completeRide(
    @Param('rideId') rideId: string,
    @Body('distance') distance: number,
  ) {
    return this.rideService.completeRide(rideId, distance);
  }




  // ❌ cancel ride
  @Patch(':rideId/cancel')
  async cancelRide(
    @Param('rideId') rideId: string,
    @Body('cancelledBy') cancelledBy: 'rider' | 'driver',
  ) {
    return this.rideService.cancelRide(rideId, cancelledBy);
  }










  // 🛣️ route history
  @Post(':rideId/route')
  async addRouteHistory(
    @Param('rideId') rideId: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.rideService.addRouteHistory(rideId, lat, lng);
  }

  // 📍 get ride
  @Get(':rideId')
  async getRide(@Param('rideId') rideId: string) {
    return this.rideService.getRide(rideId);
  }









  // ============================
  // 🧪 TEST REAL-TIME LOCATION
  // ============================
@Post('tracking/test-location')
async testLocation(@Body() body: any) {
  return this.tracking.updateDriverLocation(body);
}



@Get('tracking/:driverId')
getLocation(@Param('driverId') driverId: string) {
  return this.tracking.getLastLocation(driverId);
}




}







