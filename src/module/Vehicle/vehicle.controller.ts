// import {
//   Controller,
//   Post,
//   Body,
//   Get,
//   Param,
//   Delete,
//   UploadedFile,
//   UseInterceptors,
// } from '@nestjs/common';
// import { VehicleService } from './vehicle.service';
// import { CreateVehicleDto } from './dto/vehicles.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { Patch } from '@nestjs/common';
// import { UpdateVehicleDto } from './dto/update-vehicles.dto';

// @Controller('vehicles')
// export class VehicleController {
//   constructor(private readonly vehicleService: VehicleService) {}

//   @Post(':driverId')
//   @UseInterceptors(FileInterceptor('image'))
//   addVehicle(
//     @Param('driverId') driverId: string,
//     @Body() dto: CreateVehicleDto,
//     @UploadedFile() image?: Express.Multer.File,
//   ) {
//     return this.vehicleService.addVehicle(dto, driverId, image);
//   }

//   @Get(':driverId')
//   getVehicles(@Param('driverId') driverId: string) {
//     return this.vehicleService.getVehicles(driverId);
//   }

//   @Get('single/:id')
//   getVehicle(@Param('id') id: string) {
//     return this.vehicleService.getVehicleById(id);
//   }

//   @Delete(':id')
//   deleteVehicle(@Param('id') id: string) {
//     return this.vehicleService.deleteVehicle(id);
//   }

//   @Patch(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   updateVehicle(
//     @Param('id') id: string,
//     @Body() dto: UpdateVehicleDto,
//     @UploadedFile() image?: Express.Multer.File,
//   ) {
//     return this.vehicleService.updateVehicle(id, dto, image);
//   }
// }





// - تعليقات JSDoc فوق كل endpoint → بتوضح الهدف والـ parameters بشكل سريع لأي مطور بيقرأ الكود.
// - استخدام async بشكل consistent → عشان يوضح إن كل الميثودز بترجع Promise.
// - ترتيب الـ imports (NestJS decorators الأول، بعدين الـ services والـ DTOs).
// - تنسيق الكود بحيث يبقى سهل القراءة ومطابق لأسلوب الـ NestJS الشائع.




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

  /**
   * Add a new vehicle for a driver
   * @param driverId - Driver identifier
   * @param dto - Vehicle creation data
   * @param image - Optional vehicle image
   */
  @Post(':driverId')
  @UseInterceptors(FileInterceptor('image'))
  async addVehicle(
    @Param('driverId') driverId: string,
    @Body() dto: CreateVehicleDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.vehicleService.addVehicle(dto, driverId, image);
  }

  /**
   * Get all vehicles for a specific driver
   * @param driverId - Driver identifier
   */
  @Get(':driverId')
  async getVehicles(@Param('driverId') driverId: string) {
    return this.vehicleService.getVehicles(driverId);
  }

  /**
   * Get a single vehicle by its ID
   * @param id - Vehicle identifier
   */
  @Get('single/:id')
  async getVehicle(@Param('id') id: string) {
    return this.vehicleService.getVehicleById(id);
  }

  /**
   * Delete a vehicle by its ID
   * @param id - Vehicle identifier
   */
  @Delete(':id')
  async deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }

  /**
   * Update vehicle details
   * @param id - Vehicle identifier
   * @param dto - Vehicle update data
   * @param image - Optional new vehicle image
   */
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




