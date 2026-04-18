import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GeocodingService } from './Geocoding .service';
import { CreateRideDto } from './dto/create-ride.dto';
import { SocketService } from '../../core/socket/socket.service';
import { PricingFactory } from './pricing/pricing.factory';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class RideService {
  private readonly logger = new Logger(RideService.name);

  constructor(
    private prisma: PrismaService,
    private geo: GeocodingService,
    private socketService: SocketService,
    @InjectQueue('ride') private rideQueue: Queue,
    // @InjectQueue('ride-dead-letter')
    // private readonly deadLetterQueue: Queue,
  ) {}

  //   async createRide(
  //     riderId: string,
  //     dto: CreateRideDto,
  //     calculatePrice: boolean = true,
  //   ) {
  //     try {
  //       this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

  //       const pickup = await this.geo.getCoordinates(dto.pickupAddress);
  //       const destination = await this.geo.getCoordinates(dto.destinationAddress);

  //       const distance = this.calculateDistance(
  //         pickup.lat,
  //         pickup.lng,
  //         destination.lat,
  //         destination.lng,
  //       );

  //       const avgSpeed = 40;
  //       const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

  //       // let estimatedPrice: number | null = null;

  //       // if (calculatePrice) {
  //       //   estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
  //       // }

  //       // factory design pattern
  //       let estimatedPrice: number | null = null;

  //       if (calculatePrice) {
  //         const pricingStrategy = PricingFactory.create('standard');

  //         estimatedPrice = pricingStrategy.calculate(
  //           distance,
  //           estimatedTimeMinutes,
  //         );
  //       }

  //       const ride = await this.prisma.ride.create({
  //         data: {
  //           pickupLat: pickup.lat,
  //           pickupLng: pickup.lng,
  //           destinationLat: destination.lat,
  //           destinationLng: destination.lng,

  //           pickupAddress: dto.pickupAddress,
  //           destinationAddress: dto.destinationAddress,

  //           distance,
  //           selectedPrice: estimatedPrice,
  //           status: 'BIDDING',

  //           rider: {
  //             connect: { id: riderId },
  //           },
  //         },
  //       });

  //       this.logger.log(`✅ Ride created with ID: ${ride.id}`);

  // // // ADD QUEUE
  // //   // 6️⃣ 🚀 ADD JOB TO QUEUE (NEW PART)
  // //       await this.rideQueue.add('ride-created', {
  // //         rideId: ride.id,

  // //         riderId,

  // //         pickup: {
  // //           lat: pickup.lat,
  // //           lng: pickup.lng,
  // //           address: dto.pickupAddress,
  // //         },

  // //         destination: {
  // //           lat: destination.lat,
  // //           lng: destination.lng,
  // //         },

  // //         distance,
  // //         estimatedTimeMinutes,
  // //         estimatedPrice,
  // //       });

  // //       this.logger.log(`📦 Ride queued for processing: ${ride.id}`);

  //       const nearbyDrivers = await this.prisma.$queryRaw<
  //         { driverId: string; distance: number }[]
  //       >`
  //       SELECT
  //         dl."driverId",
  //         (
  //           6371 * acos(
  //             cos(radians(${pickup.lat})) *
  //             cos(radians(dl."lat")) *
  //             cos(radians(dl."lng") - radians(${pickup.lng})) +
  //             sin(radians(${pickup.lat})) *
  //             sin(radians(dl."lat"))
  //           )
  //         ) AS distance
  //       FROM "driver_locations" dl
  //       ORDER BY distance
  //       LIMIT 10;
  //       `;

  //       this.logger.log(`📍 Found ${nearbyDrivers.length} nearby drivers`);

  //       for (const driver of nearbyDrivers) {
  //         this.logger.debug(`📡 Sending ride to driver: ${driver.driverId}`);

  //         this.socketService.emitToDriver(driver.driverId, 'new_ride', {
  //           rideId: ride.id,

  //           pickup: {
  //             lat: pickup.lat,
  //             lng: pickup.lng,
  //             address: dto.pickupAddress,
  //           },

  //           destination: {
  //             lat: destination.lat,
  //             lng: destination.lng,
  //             address: dto.destinationAddress,
  //           },

  //           distance,
  //           estimatedTimeMinutes,
  //           estimatedPrice,
  //         });
  //       }

  //       return {
  //         ride,
  //         nearbyDrivers,
  //         estimatedTimeMinutes,
  //         estimatedPrice,
  //       };
  //     } catch (error) {
  //       this.logger.error(
  //         '❌ Error creating ride',
  //         error instanceof Error ? error.stack : String(error),
  //       );
  //       throw error;
  //     }
  //   }
  async createRide(
    riderId: string,
    dto: CreateRideDto,
    calculatePrice: boolean = true,
  ) {
    try {
      this.logger.log(`🚗 Creating ride for rider: ${riderId}`);

      // 🧠 0️⃣ Idempotency Check (by rideId)
      if (dto.rideId) {
        const existingRide = await this.prisma.ride.findUnique({
          where: {
            id: dto.rideId,
          },
        });

        if (existingRide) {
          this.logger.log('♻️ Ride already exists, returning existing ride');

          return {
            ride: existingRide,
            message: 'Ride already created (idempotent response) ♻️',
          };
        }
      }

      // 1️⃣ Get coordinates
      const pickup = await this.geo.getCoordinates(dto.pickupAddress);
      const destination = await this.geo.getCoordinates(dto.destinationAddress);

      // 2️⃣ Distance calculation
      const distance = this.calculateDistance(
        pickup.lat,
        pickup.lng,
        destination.lat,
        destination.lng,
      );

      // 3️⃣ ETA
      const avgSpeed = 40;
      const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

      // 4️⃣ Pricing
      let estimatedPrice: number | null = null;

      if (calculatePrice) {
        const pricingStrategy = PricingFactory.create('standard');

        estimatedPrice = pricingStrategy.calculate(
          distance,
          estimatedTimeMinutes,
        );
      }

      // 5️⃣ Save ride in DB
      const ride = await this.prisma.ride.create({
        data: {
          id: dto.rideId, // 👈 important for idempotency

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

      // 6️⃣ 🚀 ADD JOB TO QUEUE ONLY
      // await this.rideQueue.add('ride-created', {
      //   rideId: ride.id,
      //   riderId,

      //   pickup: {
      //     lat: pickup.lat,
      //     lng: pickup.lng,
      //     address: dto.pickupAddress,
      //   },

      //   destination: {
      //     lat: destination.lat,
      //     lng: destination.lng,
      //     address: dto.destinationAddress,
      //   },

      //   distance,
      //   estimatedTimeMinutes,
      //   estimatedPrice,
      // });

      // ✔ Retry mechanism
      // ✔ Dead Letter Queue (failed handling)
      // ✔ Proper BullMQ config
      // ✔ Worker safe error handling
      // ✔ Queue add options

      await this.rideQueue.add(
        'ride-created',
        {
          rideId: ride.id,
          riderId,

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
        },
        {
          attempts: 5,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: true,
          removeOnFail: false,
        },
      );

      this.logger.log(`📦 Ride queued for processing: ${ride.id}`);

      // 7️⃣ Return response immediately
      return {
        ride,
        estimatedTimeMinutes,
        estimatedPrice,
        message: 'Ride created successfully and queued 🚀',
      };
    } catch (error) {
      this.logger.error(
        '❌ Error creating ride',
        error instanceof Error ? error.stack : String(error),
      );
      throw error;
    }
  }

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



















































































































// أولًا: الفرق بينهم
// 🟢 PostGIS (Database Layer)

// ده extension على PostgreSQL

// بيستخدم في:

// ✔ تخزين مواقع drivers
// ✔ queries معقدة (distance, radius, polygons)
// ✔ analytics
// ✔ filtering متقدم

// 🔵 Redis GEO (In-Memory)

// سريع جدًا (RAM-based)

// بيستخدم في:

// ✔ real-time driver location
// ✔ finding nearest drivers بسرعة جدًا
// ✔ live tracking
// ✔ dispatch system

// ⚡ أهم فكرة
// PostGIS = Accuracy + Storage + Queries
// Redis GEO = Speed + Real-time
// 🚀 Architecture الصح (زي Uber)
// Driver moves
//    ↓
// Redis GEO (update location live)
//    ↓
// Client request ride
//    ↓
// Redis GEO (find nearest drivers fast)
//    ↓
// PostGIS (optional verification / analytics)
// 🟢 1) استخدام Redis GEO (الأهم في مشروعك)
// 📍 إضافة driver location
// await this.redis.geoadd(
//   'drivers:geo',
//   lng,
//   lat,
//   driverId,
// );
// 🚗 تحديث موقع السائق
// await this.redis.geoadd(
//   'drivers:geo',
//   lng,
//   lat,
//   driverId,
// );
// 🔥 جلب أقرب drivers
// const drivers = await this.redis.georadius(
//   'drivers:geo',
//   pickupLng,
//   pickupLat,
//   5, // radius in km
//   'km',
//   'WITHDIST',
//   'COUNT',
//   10,
// );
// ⚡ النتيجة
// [
//   ["driver1", "0.8 km"],
//   ["driver2", "1.2 km"]
// ]
// 🟢 مكانه في مشروعك

// بدل SQL query بتاعتك:

// prisma.$queryRaw ❌

// استبدلها بـ:

// redis.georadius ✅
// 🔵 2) استخدام PostGIS (Advanced Layer)
// 📦 تفعيل PostGIS في PostgreSQL
// CREATE EXTENSION postgis;
// 🧱 جدول drivers
// CREATE TABLE drivers (
//   id UUID PRIMARY KEY,
//   location GEOGRAPHY(Point, 4326)
// );
// 📍 إضافة driver location
// UPDATE drivers
// SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)
// WHERE id = 'driver_id';
// 🔥 جلب أقرب drivers
// SELECT id,
// ST_Distance(
//   location,
//   ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)
// ) AS distance
// FROM drivers
// ORDER BY distance
// LIMIT 10;
// ⚡ الفرق العملي المهم
// Feature	Redis GEO	PostGIS
// السرعة	⚡⚡⚡	⚡
// الدقة	جيدة	ممتازة
// real-time	ممتاز	ضعيف
// analytics	ضعيف	قوي
// production Uber use	YES	YES (backend layer)
// 🚀 أفضل Design لمشروعك (IMPORTANT)
// 💡 خليهم الاتنين:
// 1️⃣ Redis (Real-time)
// driver tracking
// nearest drivers search
// dispatch system
// 2️⃣ PostGIS (Persistent DB)
// history
// analytics
// fallback queries
// reporting
// 🧠 في Swift Ride بتاعك اعمل كده:
// 🚗 عند driver movement:
// 1. update Postgres (optional)
// 2. update Redis GEO (real-time)
// 🚗 عند request ride:
// 1. Redis GEO → get nearest drivers
// 2. send socket notifications
// 🔥 تحسين قوي جدًا (Uber logic)
// تقسيم zones:
// Cairo → zone A
// Mansoura → zone B

// Redis keys:

// drivers:geo:cairo
// drivers:geo:mansoura

// 👉 يقلل latency جدًا

// ⚡ الخلاصة
// استخدم:

// ✔ Redis GEO → real-time matching (أساسي)
// ✔ PostGIS → storage + analytics (اختياري قوي)

// 🚀 لو عايز level أعلى

// أقدر أشرح لك:

// 🔥 Uber matching algorithm (bidding system)
// 🔥 driver ranking system (score-based)
// 🔥 surge pricing based on geo density
// 🔥 live tracking WebSocket + Redis sync
// 🔥 zone-based dispatch system

// قولّي 👍