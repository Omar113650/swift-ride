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
import { RideTrackingService } from './track-live location/ride-tracking.service';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
// import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
// import { RidesService } from '../../core/redis/rides.service';
// RedisService
@ApiTags('Rides')
@Controller('rides')
export class RideController {
  constructor(
    private readonly rideService: RideService,
    private readonly tracking: RideTrackingService,
    // private readonly Rides: RidesService,
  ) {}


  @Post('add-ride')
  @ApiOperation({ summary: 'Create a new ride' })
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createRide(@Req() req, @Body() dto: CreateRideDto) {
    return this.rideService.createRide(req.User.sub, dto);
  }


  @Patch(':rideId/assign/:driverId')
  async assignDriver(
    @Param('rideId') rideId: string,
    @Param('driverId') driverId: string,
  ) {
    return this.rideService.assignDriver(rideId, driverId);
  }


  @Patch(':rideId/start')
  async startRide(@Param('rideId') rideId: string) {
    return this.rideService.startRide(rideId);
  }


  @Patch(':rideId/complete')
  async completeRide(
    @Param('rideId') rideId: string,
    @Body('distance') distance: number,
  ) {
    return this.rideService.completeRide(rideId, distance);
  }

  @Patch(':rideId/cancel')
  async cancelRide(
    @Param('rideId') rideId: string,
    @Body('cancelledBy') cancelledBy: 'rider' | 'driver',
  ) {
    return this.rideService.cancelRide(rideId, cancelledBy);
  }


  @Post(':rideId/route')
  async addRouteHistory(
    @Param('rideId') rideId: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.rideService.addRouteHistory(rideId, lat, lng);
  }
@UseGuards(ThrottlerGuard)
  @Get(':rideId')
  async getRide(@Param('rideId') rideId: string) {
    return this.rideService.getRide(rideId);
  }

  // @Get(':rideId/route')
  // getRoute(@Param('rideId') rideId: string) {
  //   return this.Rides.getRideRoute(rideId);
  // }

  //  TEST real-time location
  @Post('tracking/test-location')
  async testLocation(@Body() body: any) {
    return this.tracking.updateDriverLocation(body);
  }

  @Get('tracking/:driverId')
  getLocation(@Param('driverId') driverId: string) {
    return this.tracking.getLastLocation(driverId);
  }

  @Roles('RIDER', 'DRIVER', 'ADMIN')
   @Get('status')
  async getRidesStatsByStatus() {
    return this.rideService.getRidesStatsByStatus();
  }
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  @Get('total')
  async getTotalRides() {
    return this.rideService.getTotalRides();
  }

  //   @Patch('status')
  // async updateRideStatus(@Body() dto: UpdateRideStatusDto) {
  //   return this.rideService.updateRideStatus(dto);
  // }


  // @Get('top')
  // async getTopRiders() {
  //   const riders = await this.rideService.getTopRiders();
  //   return {
  //     message: 'Top riders fetched successfully',
  //     data: riders,
  //   };
  // }
}

