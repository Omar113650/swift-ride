import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GeocodingService } from './Geocoding/Geocoding.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { SocketService } from '../../core/socket/socket.service';

import { PricingFactory } from './pricing/pricing.factory';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { RoutingService } from './routing Ride/routing.service';
import { NotFoundError } from 'rxjs';
import { count } from 'console';
@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);

  constructor(
    private prisma: PrismaService,
    private geo: GeocodingService,
    private socketService: SocketService,
    @InjectQueue('ride') private rideQueue: Queue,
    private readonly routingService: RoutingService,
    @InjectQueue('ride-dead-letter')
    private readonly deadLetterQueue: Queue,
    // private readonly Rides: RideService,
  ) {}

  // routing and use polying
  async createRide(riderId: string, dto: CreateRideDto, calculatePrice = true) {
    this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

    // 0️⃣ Idempotency
    if (dto.rideId) {
      const existing = await this.prisma.ride.findUnique({
        where: { id: dto.rideId },
      });

      if (existing) return { ride: existing, message: 'Already exists ♻️' };
    }

    // 1️⃣ Coordinates
    const pickup = await this.geo.getCoordinates(dto.pickupAddress);
    const destination = await this.geo.getCoordinates(dto.destinationAddress);

    // 2️⃣ Route (OSRM)
    const route = await this.routingService.getRoute(
      { lat: pickup.lat, lng: pickup.lng },
      { lat: destination.lat, lng: destination.lng },
    );

    const distance = route.distance;
    const time = Math.ceil(route.duration);
    const polyline = route.polyline;

    // 3️⃣ Pricing
    const price = calculatePrice
      ? PricingFactory.create(
          distance > 100 ? 'intercity' : 'standard',
        ).calculate(distance, time)
      : null;

    // 4️⃣ Save
    const ride = await this.prisma.ride.create({
      data: {
        id: dto.rideId,
        pickupLat: pickup.lat,
        pickupLng: pickup.lng,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
        pickupAddress: dto.pickupAddress,
        destinationAddress: dto.destinationAddress,
        distance,
        polyline,
        selectedPrice: price,
        status: 'BIDDING',
        rider: { connect: { id: riderId } },
      },
    });

    // 5️⃣ Queue
    await this.rideQueue.add('ride-created', {
      rideId: ride.id,
      riderId,
      pickup,
      destination,
      distance,
      estimatedTimeMinutes: time,
      estimatedPrice: price,
      polyline,
    });

  // 🚀 5️⃣ Notify ALL DRIVERS
  this.socketService.emitToAllDrivers('new_ride', {
    rideId: ride.id,
    pickup: dto.pickupAddress,
    destination: dto.destinationAddress,
    estimatedPrice: price,
    estimatedTimeMinutes: time,
  });


    return {
      ride,
      estimatedTimeMinutes: time,
      estimatedPrice: price,
      polyline,
      message: 'Ride created 🚀',
    };
  }

  //  استخدمت خط مستقيم
  // async createRide(
  //   riderId: string,
  //   dto: CreateRideDto,
  //   calculatePrice: boolean = true,
  // ) {
  //   try {
  //     this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

  //     // 🧠 0️⃣ Idempotency Check (by rideId)
  //     if (dto.rideId) {
  //       const existingRide = await this.prisma.ride.findUnique({
  //         where: {
  //           id: dto.rideId,
  //         },
  //       });

  //       if (existingRide) {
  //         this.logger.log('♻️ Ride already exists, returning existing ride');

  //         return {
  //           ride: existingRide,
  //           message: 'Ride already created (idempotent response) ♻️',
  //         };
  //       }
  //     }

  //     // 1️⃣ Get coordinates
  //     const pickup = await this.geo.getCoordinates(dto.pickupAddress);
  //     const destination = await this.geo.getCoordinates(dto.destinationAddress);

  //     // 2️⃣ Distance calculation
  //     const distance = this.calculateDistance(
  //       pickup.lat,
  //       pickup.lng,
  //       destination.lat,
  //       destination.lng,
  //     );

  //     // 3️⃣ ETA
  //     const avgSpeed = 40;
  //     const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

  //     let estimatedPrice: number | null = null;

  //     if (calculatePrice) {
  //       estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
  //     }

  //     if (calculatePrice) {
  //       const pricingStrategy = PricingFactory.create('standard');

  //       estimatedPrice = pricingStrategy.calculate(
  //         distance,
  //         estimatedTimeMinutes,
  //       );
  //     }

  //     // 5️⃣ Save ride in DB
  //     const ride = await this.prisma.ride.create({
  //       data: {
  //         id: dto.rideId, // 👈 important for idempotency

  //         pickupLat: pickup.lat,
  //         pickupLng: pickup.lng,
  //         destinationLat: destination.lat,
  //         destinationLng: destination.lng,

  //         pickupAddress: dto.pickupAddress,
  //         destinationAddress: dto.destinationAddress,

  //         distance,
  //         selectedPrice: estimatedPrice,
  //         status: 'BIDDING',

  //         rider: {
  //           connect: { id: riderId },
  //         },
  //       },
  //     });

  //     this.logger.log(`✅ Ride created with ID: ${ride.id}`);

  //     // ✔ Retry mechanism
  //     // ✔ Dead Letter Queue (failed handling)
  //     // ✔ Proper BullMQ config
  //     // ✔ Worker safe error handling
  //     // ✔ Queue add options
  //     console.log('📤 ADDING JOB TO QUEUE: ride-created');
  //     await this.rideQueue.add(
  //       'ride-created',
  //       {
  //         rideId: ride.id,
  //         riderId,

  //         pickup: {
  //           lat: pickup.lat,
  //           lng: pickup.lng,
  //           address: dto.pickupAddress,
  //         },

  //         destination: {
  //           lat: destination.lat,
  //           lng: destination.lng,
  //           address: dto.destinationAddress,
  //         },

  //         distance,
  //         estimatedTimeMinutes,
  //         estimatedPrice,
  //       },
  //       {
  //         attempts: 5,
  //         backoff: {
  //           type: 'exponential',
  //           delay: 2000,
  //         },
  //         removeOnComplete: true,
  //         removeOnFail: false,
  //       },
  //     );

  //     console.log('✅ JOB SENT TO QUEUE:', ride.id);
  //     this.logger.log(`📦 Ride queued for processing: ${ride.id}`);

  //     // 7️⃣ Return response immediately
  //     return {
  //       ride,
  //       estimatedTimeMinutes,
  //       estimatedPrice,
  //       message: 'Ride created successfully and queued 🚀',
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       '❌ Error creating ride',
  //       error instanceof Error ? error.stack : String(error),
  //     );
  //     throw error;
  //   }
  // }

  // 📏 Distance formula (Haversine)
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number,
  ) {
    const R = 6371; // Earth radius in km

    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRad(value: number) {
    return (value * Math.PI) / 180;
  }

  async assignDriver(rideId: string, driverId: string) {
    const ride = await this.prisma.ride.findUnique({
      where: { id: rideId },
    });

    if (!ride) {
      throw new NotFoundException('Ride not found');
    }

    const driver = await this.prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      throw new NotFoundException('Driver not found');
    }

    if (driver.status === 'OFFLINE') {
      throw new BadRequestException('Driver is offline');
    }
    if (ride.driverId) {
      throw new BadRequestException('Ride already has a driver');
    }
    return await this.prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId: driver.id,
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

  // سجلت مسار الرحله
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

  // calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  //   const R = 6371;

  //   const dLat = this.toRad(lat2 - lat1);
  //   const dLon = this.toRad(lon2 - lon1);

  //   const a =
  //     Math.sin(dLat / 2) ** 2 +
  //     Math.cos(this.toRad(lat1)) *
  //       Math.cos(this.toRad(lat2)) *
  //       Math.sin(dLon / 2) ** 2;

  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   return R * c;
  // }

  // toRad(value: number) {
  //   return (value * Math.PI) / 180;
  // }

  async getRidesStatsByStatus() {
    return this.prisma.ride.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
    });
  }

  async getTotalRides() {
    return this.prisma.ride.count();
  }
}
