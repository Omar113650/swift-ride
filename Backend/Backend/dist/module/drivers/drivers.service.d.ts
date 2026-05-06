import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverStatus } from '@prisma/client';
import { GeocodingService } from '../rides/Geocoding/Geocoding.service';
import { RedisService } from '../../common/logger/cache/redis.service';
import { CustomLoggerService } from '../../common/logger/custom-logger.service';
import { ConfigService } from '@nestjs/config';
export declare class DriverService {
    private prisma;
    private geo;
    private readonly redis;
    private readonly redisService;
    private readonly logger;
    private readonly config;
    private elastic;
    constructor(prisma: PrismaService, geo: GeocodingService, redis: any, redisService: RedisService, logger: CustomLoggerService, config: ConfigService);
    indexDriver(driver: any): Promise<void>;
    createDriver(userId: string, dto: CreateDriverDto): Promise<{
        rating: number | null;
        id: string;
        createdAt: Date;
        userId: string;
        licenseNumber: string;
        nationalId: string;
        status: import(".prisma/client").$Enums.DriverStatus;
        isVerified: boolean;
        currentRideId: string | null;
        lastLogin: Date | null;
    }>;
    getDrivers(req: any, query: any): Promise<{
        source: string;
        data: any;
    } | {
        currentPage: number;
        totalPages: number;
        totalCount: any;
        hasNextPage: boolean;
        hasPrevPage: boolean;
        data: any;
        source: string;
    }>;
    updateDriver(driverId: string, dto: UpdateDriverDto): Promise<{
        rating: number | null;
        id: string;
        createdAt: Date;
        userId: string;
        licenseNumber: string;
        nationalId: string;
        status: import(".prisma/client").$Enums.DriverStatus;
        isVerified: boolean;
        currentRideId: string | null;
        lastLogin: Date | null;
    }>;
    updateStatus(driverId: string, status: DriverStatus): Promise<{
        rating: number | null;
        id: string;
        createdAt: Date;
        userId: string;
        licenseNumber: string;
        nationalId: string;
        status: import(".prisma/client").$Enums.DriverStatus;
        isVerified: boolean;
        currentRideId: string | null;
        lastLogin: Date | null;
    }>;
    updateLocationByAddress(driverId: string, address: string): Promise<{
        updatedAt: Date;
        status: import(".prisma/client").$Enums.DriverStatus;
        driverId: string;
        lat: number;
        lng: number;
        accuracy: number | null;
        speed: number | null;
        heading: number | null;
        lastSeen: Date | null;
    }>;
    getDriverRides(driverId: string): Promise<({
        rideBids: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.BidStatus;
            driverId: string;
            rideId: string;
            price: number;
            arrivalTime: number;
            isSelected: boolean;
        }[];
        rider: {
            name: string;
            email: string;
            phone: string;
            password: string;
            role: import(".prisma/client").$Enums.UserRole;
            id: string;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.RideStatus;
        driverId: string | null;
        route: string | null;
        riderId: string;
        pickupLat: number;
        pickupLng: number;
        destinationLat: number;
        destinationLng: number;
        pickupAddress: string | null;
        destinationAddress: string | null;
        selectedPrice: number | null;
        distance: number | null;
        polyline: string | null;
        startedAt: Date | null;
        completedAt: Date | null;
        cancelledBy: string | null;
    })[]>;
    getWallet(driverId: string): Promise<{
        id: string;
        updatedAt: Date;
        driverId: string;
        balance: number;
        currency: string;
        lastTransactionAt: Date | null;
    }>;
    updateWalletBalance(driverId: string, amount: number): Promise<{
        id: string;
        updatedAt: Date;
        driverId: string;
        balance: number;
        currency: string;
        lastTransactionAt: Date | null;
    }>;
    findNearbyDrivers(lat: number, lng: number): Promise<any>;
    searchDrivers(query: string): Promise<any[]>;
    findBestDrivers(lat: number, lng: number): Promise<any[]>;
}
