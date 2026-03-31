// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../../core/prisma/prisma.service';
// import { GeocodingService } from './Geocoding .service';
// import { CreateRideDto } from './dto/create-ride.dto';

// @Injectable()
// export class RideService {
//   constructor(
//     private prisma: PrismaService,
//     private geo: GeocodingService,
//   ) {}

//   // ================================
//   // 1️⃣ Create Ride
//   // ================================
//   async createRide(
//     riderId: string,
//     dto: CreateRideDto,
//     calculatePrice: boolean = true,
//   ) {
//     // 1. Geocoding
//     const pickup = await this.geo.getCoordinates(dto.pickupAddress);
//     const destination = await this.geo.getCoordinates(dto.destinationAddress);

//     // 2. Distance calculation
//     const distance = this.calculateDistance(
//       pickup.lat,
//       pickup.lng,
//       destination.lat,
//       destination.lng,
//     );

//     // 3. ETA
//     const avgSpeed = 40;
//     const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

//     // 4. Price estimation
//     let estimatedPrice: number | null = null;

//     if (calculatePrice) {
//       estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
//     }

//     // 5. Create Ride
//     const ride = await this.prisma.ride.create({
//       data: {
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

// // const nearbyDrivers = await this.prisma.$queryRaw<
// //   { id: string; distance: number }[]
// // >`
// //   SELECT 
// //     id,
// //     ST_Distance(
// //       location,
// //       ST_SetSRID(ST_MakePoint(${pickup.lng}, ${pickup.lat}), 4326)
// //     ) AS distance
// //   FROM "Driver"
// //   WHERE location IS NOT NULL
// //   ORDER BY location <-> ST_SetSRID(ST_MakePoint(${pickup.lng}, ${pickup.lat}), 4326)
// //   LIMIT 5;
// // `;
       

//     return {
//       ride,
//       // nearbyDrivers,
//       estimatedTimeMinutes,
//       estimatedPrice,
//     };
//   }

//   // ================================
//   // 2️⃣ Assign Driver
//   // ================================
//   async assignDriver(rideId: string, driverId: string) {
//     return this.prisma.ride.update({
//       where: { id: rideId },
//       data: {
//         driverId,
//         status: 'DRIVER_SELECTED',
//       },
//     });
//   }

//   // ================================
//   // 3️⃣ Start Ride
//   // ================================
//   async startRide(rideId: string) {
//     return this.prisma.ride.update({
//       where: { id: rideId },
//       data: {
//         status: 'STARTED',
//         startedAt: new Date(),
//       },
//     });
//   }

//   // ================================
//   // 4️⃣ Complete Ride
//   // ================================
//   async completeRide(rideId: string, distance: number) {
//     return this.prisma.ride.update({
//       where: { id: rideId },
//       data: {
//         status: 'COMPLETED',
//         completedAt: new Date(),
//         distance,
//       },
//     });
//   }

//   // ================================
//   // 5️⃣ Cancel Ride
//   // ================================
//   async cancelRide(rideId: string, cancelledBy: 'rider' | 'driver') {
//     return this.prisma.ride.update({
//       where: { id: rideId },
//       data: {
//         status: 'CANCELLED',
//         cancelledBy,
//       },
//     });
//   }

//   // ================================
//   // 6️⃣ Route Tracking
//   // ================================
//   async addRouteHistory(rideId: string, lat: number, lng: number) {
//     return this.prisma.rideRoute.create({
//       data: {
//         rideId,
//         lat,
//         lng,
//         timestamp: new Date(),
//       },
//     });
//   }

//   // ================================
//   // 7️⃣ Get Ride
//   // ================================
//   async getRide(rideId: string) {
//     return this.prisma.ride.findUnique({
//       where: { id: rideId },
//       include: {
//         rider: true,
//         driver: true,
//         routeHistory: true,
//         payment: true,
//       },
//     });
//   }

//   // ================================
//   // 📍 Distance (Haversine)
//   // ================================
//   calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
//     const R = 6371;

//     const dLat = this.toRad(lat2 - lat1);
//     const dLon = this.toRad(lon2 - lon1);

//     const a =
//       Math.sin(dLat / 2) ** 2 +
//       Math.cos(this.toRad(lat1)) *
//         Math.cos(this.toRad(lat2)) *
//         Math.sin(dLon / 2) ** 2;

//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

//     return R * c;
//   }

//   toRad(value: number) {
//     return (value * Math.PI) / 180;
//   }
// }

















//  بعد اضافه postgres واضافع عمور location





























import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import { GeocodingService } from './Geocoding .service';
import { CreateRideDto } from './dto/create-ride.dto';

@Injectable()
export class RideService {
  constructor(
    private prisma: PrismaService,
    private geo: GeocodingService,
  ) {}

  // ================================
  // 1️⃣ Create Ride (WITH POSTGIS)
  // ================================
  async createRide(
    riderId: string,
    dto: CreateRideDto,
    calculatePrice: boolean = true,
  ) {
    const pickup = await this.geo.getCoordinates(dto.pickupAddress);
    const destination = await this.geo.getCoordinates(dto.destinationAddress);

    // PostGIS point for pickup
    const pickupPoint = `ST_SetSRID(ST_MakePoint(${pickup.lng}, ${pickup.lat}), 4326)`;

    const destinationPoint = `ST_SetSRID(ST_MakePoint(${destination.lng}, ${destination.lat}), 4326)`;

    // =========================
    // 2. Distance (still OK)
    // =========================
    const distance = this.calculateDistance(
      pickup.lat,
      pickup.lng,
      destination.lat,
      destination.lng,
    );

    const avgSpeed = 40;
    const estimatedTimeMinutes = Math.ceil((distance / avgSpeed) * 60);

    let estimatedPrice: number | null = null;

    if (calculatePrice) {
      estimatedPrice = distance * 0.5 + estimatedTimeMinutes * 0.2;
    }

    // =========================
    // 3. Create Ride
    // =========================
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

    // =========================
    // 4. 🔥 NEARBY DRIVERS (POSTGIS)
    // =========================
const nearbyDrivers = await this.prisma.$queryRaw<
  { driverId: string; distance: number }[]
>`
  SELECT 
    dl."driverId",
    (
      6371 * acos(
        cos(radians(${pickup.lat})) * 
        cos(radians(dl.lat)) * 
        cos(radians(dl.lng) - radians(${pickup.lng})) + 
        sin(radians(${pickup.lat})) * 
        sin(radians(dl.lat))
      )
    ) AS distance
  FROM "DriverLocation" dl
  ORDER BY distance
  LIMIT 5;
`;

    return {
      ride,
      nearbyDrivers,
      estimatedTimeMinutes,
      estimatedPrice,
    };
  }

  // ================================
  // 2️⃣ Assign Driver
  // ================================
  async assignDriver(rideId: string, driverId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        status: 'DRIVER_SELECTED',
      },
    });
  }

  // ================================
  // 3️⃣ Start Ride
  // ================================
  async startRide(rideId: string) {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'STARTED',
        startedAt: new Date(),
      },
    });
  }

  // ================================
  // 4️⃣ Complete Ride
  // ================================
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

  // ================================
  // 5️⃣ Cancel Ride
  // ================================
  async cancelRide(rideId: string, cancelledBy: 'rider' | 'driver') {
    return this.prisma.ride.update({
      where: { id: rideId },
      data: {
        status: 'CANCELLED',
        cancelledBy,
      },
    });
  }

  // ================================
  // 6️⃣ Route Tracking
  // ================================
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

  // ================================
  // 7️⃣ Get Ride
  // ================================
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

  // ================================
  // 📍 Haversine (fallback only)
  // ================================
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
}




