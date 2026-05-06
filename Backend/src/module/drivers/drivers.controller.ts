import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  ParseUUIDPipe,
  UseGuards,
  Query,
  Req,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { DriverStatus } from '@prisma/client';
@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post(':userId')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateDriverDto,
  ) {
    return this.driverService.createDriver(userId, dto);
  }

  @Patch(':driverId')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  update(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(driverId, dto);
  }

  @Patch(':driverId/status')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  updateStatus(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body('status') status: DriverStatus,
  ) {
    return this.driverService.updateStatus(driverId, status);
  }

  @Patch(':driverId/location/address')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  updateLocationByAddress(
    @Param('driverId') driverId: string,
    @Body() body: { address: string },
  ) {
    return this.driverService.updateLocationByAddress(driverId, body.address);
  }

  @Get(':driverId/rides')
  @UseGuards(ThrottlerGuard, RolesGuard)
  @Roles('DRIVER')
  getRides(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getDriverRides(driverId);
  }

@UseGuards(ThrottlerGuard, RolesGuard)
@Roles('DRIVER')
@Get()
async getDrivers(@Req() req, @Query() query: any) {
  return this.driverService.getDrivers(req, query);
}

  @Get('nearby')
  @UseGuards(ThrottlerGuard, RolesGuard)
  @Roles('DRIVER')
  findNearby(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.driverService.findNearbyDrivers(+lat, +lng);
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.driverService.searchDrivers(query);
  }
  @Get(':driverId/wallet')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  getWallet(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getWallet(driverId);
  }
}
