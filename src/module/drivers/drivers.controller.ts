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
  update(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(driverId, dto);
  }

  @Patch(':driverId/status')
  updateStatus(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body('status') status: string,
  ) {
    // return this.driverService.updateStatus(driverId, status);
  }

  @Patch(':driverId/location/address')
  updateLocationByAddress(
    @Param('driverId') driverId: string,
    @Body() body: { address: string },
  ) {
    return this.driverService.updateLocationByAddress(driverId, body.address);
  }

  @Get(':driverId/rides')
  getRides(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getDriverRides(driverId);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  async getDrivers(@Req() req) {
    return this.driverService.getDrivers(req);
  }

  @Get('nearby')
  findNearby(@Query('lat') lat: number, @Query('lng') lng: number) {
    return this.driverService.findNearbyDrivers(+lat, +lng);
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.driverService.searchDrivers(query);
  }

  @Get(':driverId/ratings')
  getRatings(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getRatings(driverId);
  }

  @Get(':driverId/wallet')
  getWallet(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getWallet(driverId);
  }
}
