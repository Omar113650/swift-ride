import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Get,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { DriverService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/create-driver.dto';
import { RolesGuard } from 'src/core/guards/roles.guard';
import { Roles } from 'src/core/decorators/roles.decorator';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  // إنشاء حساب سائق
  @Post(':userId')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  create(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: CreateDriverDto,
  ) {
    return this.driverService.createDriver(userId, dto);
  }

  // تحديث بيانات السائق
  @Patch(':driverId')
  update(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverDto,
  ) {
    return this.driverService.updateDriver(driverId, dto);
  }

  // تحديث حالة السائق
  @Patch(':driverId/status')
  updateStatus(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body('status') status: string,
  ) {
    // return this.driverService.updateStatus(driverId, status);
  }

  // تحديث موقع السائق
  @Patch(':driverId/location')
  updateLocation(
    @Param('driverId', ParseUUIDPipe) driverId: string,
    @Body() dto: UpdateDriverLocationDto,
  ) {
    return this.driverService.updateLocation(driverId, dto);
  }

  // جلب كل الرحلات
  @Get(':driverId/rides')
  getRides(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getDriverRides(driverId);
  }

  // جلب تقييمات السائق
  @Get(':driverId/ratings')
  getRatings(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getRatings(driverId);
  }

  // جلب محفظة السائق
  @Get(':driverId/wallet')
  getWallet(@Param('driverId', ParseUUIDPipe) driverId: string) {
    return this.driverService.getWallet(driverId);
  }
  @Get()
  // @UseGuards(RolesGuard)
  // @Roles('DRIVER', 'ADMIN')
  async getDrivers() {
    return this.driverService.getDrivers();
  }
}
// RIDER//
// DRIVER
// ADMIN
