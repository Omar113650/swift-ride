import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { CreateVehicleDto } from './dto/vehicles.dto';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';

@Injectable()
export class VehicleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  //  Upload image to Cloudinary
  private async uploadImage(
    image?: Express.Multer.File,
  ): Promise<{ url: string; publicId: string } | undefined> {
    if (!image) return undefined;

    const result = await this.cloudinaryService.uploadFile(image);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

//   // Ensure driver exists
//   private async ensureDriverExists(driverId: string) {
// const driver = await this.prisma.user.findUnique({
//   where: { id: driverId, role: 'DRIVER' },
// });
//     if (!driver) {
//       throw new NotFoundException('Driver not found');
//     }

//     return driver;
//   }


private async ensureDriverExists(driverId: string) {
  const driver = await this.prisma.driver.findUnique({
    where: { id: driverId },
  });

  if (!driver) {
    throw new NotFoundException('Driver not found');
  }

  return driver;
}




  // Ensure plate number is unique
  private async ensureUniquePlate(plateNumber: string, excludeId?: string) {
    const existing = await this.prisma.vehicle.findUnique({
      where: { plateNumber },
    });

    if (existing && existing.id !== excludeId) {
      throw new ConflictException('Plate number already exists');
    }
  }

  // Add Vehicle
  async addVehicle(
    dto: CreateVehicleDto,
    driverId : string,
    image?: Express.Multer.File,
  ) {
    await this.ensureDriverExists(driverId);
    await this.ensureUniquePlate(dto.plateNumber);

    const imageData = await this.uploadImage(image);

    return this.prisma.vehicle.create({
      data: {
        ...dto,
        image: imageData?.url,
        imagePublicId: imageData?.publicId,
        driverId,
      },
    });
  }

  //  Get all vehicles for driver
  async getVehicles(driverId: string) {
    return this.prisma.vehicle.findMany({
      where: { driverId },
    });
  }

  //  Get vehicle by ID
  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  // Delete vehicle
  async deleteVehicle(id: string) {
    const vehicle = await this.getVehicleById(id);

    if (vehicle.imagePublicId) {
      await this.cloudinaryService.deleteFile(vehicle.imagePublicId);
    }
    await this.prisma.vehicle.delete({
      where: { id },
    });
    return { message: 'Vehicle deleted successfully' };
  }

  // Update vehicle
  async updateVehicle(
    id: string,
    dto: UpdateVehicleDto,
    image?: Express.Multer.File,
  ) {
    const vehicle = await this.getVehicleById(id);

    if (dto.plateNumber) {
      await this.ensureUniquePlate(dto.plateNumber, id);
    }
    let imageData;

    // لو في صوره جديده حملها وامسح القديمه
    if (image) {
      if (vehicle.imagePublicId) {
        await this.cloudinaryService.deleteFile(vehicle.imagePublicId);
      }
      imageData = await this.uploadImage(image);
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...dto,
        ...(imageData && {
          image: imageData.url,
          imagePublicId: imageData.publicId,
        }),
      },
    });
  }
}
