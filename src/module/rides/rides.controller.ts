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
import { RolesGuard } from 'src/core/guards/roles.guard';
// import { JwtAuthGuard } from 'src/core/guards/jwt-auth.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

@ApiTags('Rides')
@Controller('rides')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  // ================================
  // 1️⃣ إنشاء رحلة جديدة
  // ================================
  @Post('add-ride')
  @ApiOperation({ summary: 'Create a new ride' })
  @UseGuards(RolesGuard)
  @Roles('RIDER', 'DRIVER', 'ADMIN')
  async createRide(
    @Req() req,
    @Body() dto: CreateRideDto,
    // مفترض تجيب الـ riderId من Auth
  ) {

return this.rideService.createRide(req.User.sub, dto);  }

  // ================================
  // 2️⃣ Assign driver
  // ================================
  @Patch(':rideId/assign/:driverId')
  @ApiOperation({ summary: 'Assign a driver to a ride' })
  async assignDriver(
    @Param('rideId') rideId: string,
    @Param('driverId') driverId: string,
  ) {
    return this.rideService.assignDriver(rideId, driverId);
  }

  // ================================
  // 3️⃣ Start ride
  // ================================
  @Patch(':rideId/start')
  @ApiOperation({ summary: 'Start a ride' })
  async startRide(@Param('rideId') rideId: string) {
    return this.rideService.startRide(rideId);
  }

  // ================================
  // 4️⃣ Complete ride
  // ================================
  @Patch(':rideId/complete')
  @ApiOperation({ summary: 'Complete a ride' })
  async completeRide(
    @Param('rideId') rideId: string,
    @Body('distance') distance: number, // المسافة النهائية (كم)
  ) {
    return this.rideService.completeRide(rideId, distance);
  }

  // ================================
  // 5️⃣ Cancel ride
  // ================================
  @Patch(':rideId/cancel')
  @ApiOperation({ summary: 'Cancel a ride' })
  async cancelRide(
    @Param('rideId') rideId: string,
    @Body('cancelledBy') cancelledBy: 'rider' | 'driver',
  ) {
    return this.rideService.cancelRide(rideId, cancelledBy);
  }

  // ================================
  // 6️⃣ Add route history
  // ================================
  @Post(':rideId/route')
  @ApiOperation({ summary: 'Add route history for real-time tracking' })
  async addRouteHistory(
    @Param('rideId') rideId: string,
    @Body('lat') lat: number,
    @Body('lng') lng: number,
  ) {
    return this.rideService.addRouteHistory(rideId, lat, lng);
  }

  // ================================
  // 7️⃣ Get ride details
  // ================================
  @Get(':rideId')
  @ApiOperation({ summary: 'Get ride details' })
  async getRide(@Param('rideId') rideId: string) {
    return this.rideService.getRide(rideId);
  }
}

// اللي لسه محتاجينه بعد كده

// 1️⃣ Dispatch / Driver Matching

// نلاقي أقرب Drivers بالـ Redis Geo
// نرسل لهم ride request real-time عبر Socket.IO

// 2️⃣ Driver Bidding System

// Sockets أو REST endpoints للسائقين يرسلوا عروضهم
// المستخدم يختار العرض المناسب → update Ride

// 3️⃣ Payment Integration

// بعد اكتمال الرحلة → generate Payment record
// تحديث محفظة السائق (DriverWallet)

// 4️⃣ Notifications

// إشعارات للمستخدم والسائق لكل مرحلة من الرحلة

// 5️⃣ Analytics / Logging / Queue Jobs

// BullMQ للمهام الثقيلة: notifications, ride matching, payment processing
