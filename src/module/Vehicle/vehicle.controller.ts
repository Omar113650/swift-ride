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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  // Add a new vehicle for a driver
  @Post(':driverId')
  @UseInterceptors(FileInterceptor('image'))
  async addVehicle(
    @Param('driverId') driverId: string,
    @Body() dto: CreateVehicleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vehicleService.addVehicle(dto, driverId, image);
  }

  //  Get all vehicles for a specific driver
  @Get(':driverId')
  async getVehicles(@Param('driverId') driverId: string) {
    return this.vehicleService.getVehicles(driverId);
  }

  // Get a single vehicle by its ID
  @Get('single/:id')
  async getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicleById(id);
  }

  // Delete a vehicle by its ID
  @Delete(':id')
  async deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }

  // Update vehicle details
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async updateVehicle(
    @Param('id') id: string,
    @Body() dto: UpdateVehicleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vehicleService.updateVehicle(id, dto, image);
  }
}
