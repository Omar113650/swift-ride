import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GeocodingService } from './Geocoding .service';
import { CreateRideDto } from './dto/create-ride.dto';
import { SocketService } from '../../core/socket/socket.service';
import { PricingFactory } from './pricing/pricing.factory';

@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);

  constructor(
    private prisma: PrismaService,
    private geo: GeocodingService,
    private socketService: SocketService
  ) {}

  async createRide(
    riderId: string,
    dto: CreateRideDto,
    calculatePrice: boolean = true,
  ) {
    try {
      this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

      const pickup = await this.geo.getCoordinates(dto.pickupAddress);
      const destination = await this.geo.getCoordinates(dto.destinationAddress);

      const distance = this.calculateDistance(
        pickup.lat,
        pickup.lng,
        destination.lat,
        destination.lng,
      );

      const avgSpeed = 40;
      const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

      // let estimatedPrice: number | null = null;

      // if (calculatePrice) {
      //   estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
      // }

// factory design pattern 
let estimatedPrice: number | null = null;

if (calculatePrice) {
  const pricingStrategy = PricingFactory.create('standard');

  estimatedPrice = pricingStrategy.calculate(
    distance,
    estimatedTimeMinutes,
  );
}

      const ride = await this.prisma.ride.create({
        data: {
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          destinationLat: destination.lat,
          destinationLng: destination.lng,

          pickupAddress: dto.pickupAddress,
          destinationAddress: dto.destinationAddress,

          distance,
          selectedPrice: estimatedPrice,
          status: 'BIDDING',

          rider: {
            connect: { id: riderId },
          },
        },
      });

      this.logger.log(`✅ Ride created with ID: ${ride.id}`);

      const nearbyDrivers = await this.prisma.$queryRaw<
        { driverId: string; distance: number }[]
      >`
      SELECT 
        dl."driverId",
        (
          6371 * acos(
            cos(radians(${pickup.lat})) * 
            cos(radians(dl."lat")) * 
            cos(radians(dl."lng") - radians(${pickup.lng})) + 
            sin(radians(${pickup.lat})) * 
            sin(radians(dl."lat"))
          )
        ) AS distance
      FROM "driver_locations" dl
      ORDER BY distance
      LIMIT 10;
      `;

      this.logger.log(`📍 Found ${nearbyDrivers.length} nearby drivers`);

      for (const driver of nearbyDrivers) {
        this.logger.debug(`📡 Sending ride to driver: ${driver.driverId}`);

        this.socketService.emitToDriver(driver.driverId, 'new_ride', {
          rideId: ride.id,

          pickup: {
            lat: pickup.lat,
            lng: pickup.lng,
            address: dto.pickupAddress,
          },

          destination: {
            lat: destination.lat,
            lng: destination.lng,
            address: dto.destinationAddress,
          },

          distance,
          estimatedTimeMinutes,
          estimatedPrice,
        });
      }

      return {
        ride,
        nearbyDrivers,
        estimatedTimeMinutes,
        estimatedPrice,
      };

    } catch (error) {
      this.logger.error('❌ Error creating ride', error instanceof Error ? error.stack : String(error));
      throw error;
    }
  }


  
// const { correlationId, method, url } = req;

// this.logger.log(`[${correlationId}] ${method} ${url}`);


  async assignDriver(rideId: string, driverId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        status: 'DRIVER_SELECTED',
      },
    });
  }

  async startRide(rideId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'STARTED',
        startedAt: new Date(),
      },
    });
  }

  async completeRide(rideId: string, distance: number) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        distance,
      },
    });
  }

  async cancelRide(rideId: string, cancelledBy: 'rider' | 'driver') {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'CANCELLED',
        cancelledBy,
      },
    });
  }

  async addRouteHistory(rideId: string, lat: number, lng: number) {
    return this.prisma.rideRoute.create({
      data: {
        rideId,
        lat,
        lng,
        timestamp: new Date(),
      },
    });
  }

  async getRide(rideId: string) {
    return this.prisma.ride.findUnique({
      where: { id: rideId },
      include: {
        rider: true,
        driver: true,
        routeHistory: true,
        payment: true,
      },
    });
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;

    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  toRad(value: number) {
    return (value * Math.PI) / 180;
  }

async approveBid(rideId: string, driverId: string) {
  const bid = await this.prisma.rideBid.update({
    where: {
      rideId_driverId: {
        rideId,
        driverId,
      },
    },
    data: {
      // status: BidStatus.ACCEPTED,
    },
  });

  return bid;
}
}
