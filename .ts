import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateVehicleDto } from './dto/vehicles.dto';
import { CloudinaryService } from '../../core/cloudinary/cloudinary.service';
import { UpdateVehicleDto } from './dto/update-vehicles.dto';
@Injectable()
export class VehicleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async addVehicle(
    dto: CreateVehicleDto,
    driverId: string,
    image?: Express.Multer.File,
  ) {
    let imageUrl: string | undefined;

    // ✅ upload image
    if (image) {
      const result = await this.cloudinaryService.uploadFile(image);
      imageUrl = result.secure_url;
    }

    // ✅ check driver
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) throw new NotFoundException('Driver not found');

    // ✅ check duplicate plate
    const existing = await this.prisma.vehicle.findUnique({
      where: { plateNumber: dto.plateNumber },
    });

    if (existing) throw new ConflictException('Vehicle already exists');

    // ✅ create vehicle
    return this.prisma.vehicle.create({
      data: {
        ...dto,
        image: imageUrl,
        driverId,
      },
    });
  }

  async getVehicles(driverId: string) {
    return this.prisma.vehicle.findMany({
      where: { driverId },
    });
  }

  async getVehicleById(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    return vehicle;
  }

  async deleteVehicle(id: string) {
    await this.getVehicleById(id);

    await this.prisma.vehicle.delete({
      where: { id },
    });

    return { message: 'Vehicle deleted successfully' };
  }

  async updateVehicle(
    id: string,
    dto: UpdateVehicleDto,
    image?: Express.Multer.File,
  ) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');

    let imageUrl: string | undefined;

    // ✅ upload new image
    if (image) {
      const result = await this.cloudinaryService.uploadFile(image);
      imageUrl = result.secure_url;
    }

    // ✅ لو غير plateNumber نتأكد مفيش duplicate
    if (dto.plateNumber) {
      const existing = await this.prisma.vehicle.findUnique({
        where: { plateNumber: dto.plateNumber },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Plate number already exists');
      }
    }

    return this.prisma.vehicle.update({
      where: { id },
      data: {
        ...dto,
        ...(imageUrl && { image: imageUrl }), // 👈 optional update
      },
    });
  }
}