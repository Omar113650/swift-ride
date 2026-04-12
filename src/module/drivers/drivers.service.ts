import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { UpdateDriverLocationDto } from './dto/update-driver-location.dto';
import { DriverStatus } from '@prisma/client';
import { GeocodingService } from '../rides/Geocoding .service';

@Injectable()
export class DriverService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS') private readonly redis: any,
     private geo: GeocodingService,
  ) {}

  async createDriver(userId: string, dto: CreateDriverDto) {
    const existingDriver = await this.prisma.driver.findUnique({
      where: { userId },
    });
    if (existingDriver) throw new BadRequestException('Driver already exists');

    return this.prisma.driver.create({
      data: {
        userId,
        licenseNumber: dto.licenseNumber,
        nationalId: dto.nationalId,
        status: dto.status || DriverStatus.OFFLINE,
      },
    });
  }

  async getDrivers() {
    const drivers = await this.prisma.driver.findMany();

    if (!drivers.length) {
      throw new NotFoundException('No drivers found');
    }
    return {
      data: drivers,
    };
  }

  async updateDriver(driverId: string, dto: UpdateDriverDto) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) throw new NotFoundException('Driver not found');

    return this.prisma.driver.update({
      where: { id: driverId },
      data: dto,
    });
  }

  async updateStatus(driverId: string, status: DriverStatus) {
    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });
    if (!driver) throw new NotFoundException('Driver not found');

    return this.prisma.driver.update({
      where: { id: driverId },
      data: { status },
    });
  }
async updateLocationByAddress(driverId: string, address: string) {
  // 🌍 تحويل العنوان إلى lat/lng
  const coords = await this.geo.getCoordinates(address);

  // 💾 حفظ في DB
  return this.prisma.driverLocation.upsert({
    where: { driverId },

    update: {
      lat: coords.lat,
      lng: coords.lng,
      lastSeen: new Date(),
      status: 'ONLINE',
    },

    create: {
      driverId,
      lat: coords.lat,
      lng: coords.lng,
      lastSeen: new Date(),
      status: 'ONLINE',
    },
  });
}

  async getDriverRides(driverId: string) {
    return this.prisma.ride.findMany({
      where: { driverId },
      include: { rideBids: true, rider: true },
    });
  }

  async getRatings(driverId: string) {
    return this.prisma.rating.findMany({ where: { driverId } });
  }

  async getWallet(driverId: string) {
    const wallet = await this.prisma.driverWallet.findUnique({
      where: { driverId },
    });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet;
  }

  async updateWalletBalance(driverId: string, amount: number) {
    const wallet = await this.prisma.driverWallet.update({
      where: { driverId },
      data: { balance: { increment: amount } },
    });
    return wallet;
  }

  async notifyDriver(driverId: string, type: string, data: any) {
    // this.socketService.emitToUser(driverId, type, data);
  }

  // 📍 Find nearby drivers
  async findNearbyDrivers(lat: number, lng: number) {
    const drivers = await this.redis.geoSearch(
      'drivers:available',
      {
        longitude: lng,
        latitude: lat,
      },
      {
        radius: 5,
        unit: 'km',
        SORT: 'ASC',
      },
    );

    return drivers;
  }





















}
