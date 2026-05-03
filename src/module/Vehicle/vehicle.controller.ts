import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';
import { Roles } from '../../core/decorators/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Add a new vehicle for a driver
  @Post('add-vehicle/:driverId')
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  async addVehicle(
    @Param('driverId') driverId: string,
    @Body() dto: CreateVehicleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vehicleService.addVehicle(dto, driverId, image);
  }

  // Get all vehicles for a specific driver
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  @Get(':driverId')
  async getVehicles(@Param('driverId') driverId: string) {
    return this.vehicleService.getVehicles(driverId);
  }

  // Get a single vehicle by its ID  @UseGuards(RolesGuard)
  @UseGuards(RolesGuard)
  @Roles('DRIVER', 'ADMIN')
  @Get('single/:id')
  async getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicleById(id);
  }

  // Delete a vehicle by its ID
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('DRIVER', 'ADMIN')
  async deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }

  // Update vehicle details
  @Patch(':id')
  @Roles('DRIVER', 'ADMIN')
  @UseInterceptors(FileInterceptor('image'))
  async updateVehicle(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vehicleService.updateVehicle(id, dto, image);
  }
}
