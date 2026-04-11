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

// import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@ApiTags('Rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post('add-ride')
  @ApiOperation({ summary: 'Create a new ride' })
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createRide(
    @Req() req,
    @Body() dto: CreateRideDto,
    // مفترض تجيب الـ riderId من Auth
  ) {
    return this.rideService.createRide(req.User.sub, dto);
  }

  @Patch(':rideId/assign/:driverId')
  @ApiOperation({ summary: 'Assign a driver to a ride' })
  async assignDriver(
    @Param('rideId') rideId: string,
    @Param('driverId') driverId: string,
  ) {
    return this.rideService.assignDriver(rideId, driverId);
  }

  @Patch(':rideId/start')
  @ApiOperation({ summary: 'Start a ride' })
  async startRide(@Param('rideId') rideId: string) {
    return this.rideService.startRide(rideId);
  }

  @Patch(':rideId/complete')
  @ApiOperation({ summary: 'Complete a ride' })
  async completeRide(
    @Param('rideId') rideId: string,
    @Body('distance') distance: number, // المسافة النهائية (كم)
  ) {
    return this.rideService.completeRide(rideId, distance);
  }

  @Patch(':rideId/cancel')
  @ApiOperation({ summary: 'Cancel a ride' })
  async cancelRide(
    @Param('rideId') rideId: string,
    @Body('cancelledBy') cancelledBy: 'rider' | 'driver',
  ) {
    return this.rideService.cancelRide(rideId, cancelledBy);
  }

  @Post(':rideId/route')
  @ApiOperation({ summary: 'Add route history for real-time tracking' })
  async addRouteHistory(
    @Param('rideId') rideId: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.rideService.addRouteHistory(rideId, lat, lng);
  }

  @Get(':rideId')
  @ApiOperation({ summary: 'Get ride details' })
  async getRide(@Param('rideId') rideId: string) {
    return this.rideService.getRide(rideId);
  }
}
