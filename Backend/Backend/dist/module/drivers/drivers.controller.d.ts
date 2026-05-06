import { DriverService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverStatus } from '@prisma/client';
export declare class DriverController {
    private readonly driverService;
    constructor(driverService: DriverService);
    create(userId: string, dto: CreateDriverDto): Promise<{
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
    update(driverId: string, dto: UpdateDriverDto): Promise<{
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
    updateLocationByAddress(driverId: string, body: {
        address: string;
    }): Promise<{
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
    getRides(driverId: string): Promise<({
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
    findNearby(lat: number, lng: number): Promise<any>;
    search(query: string): Promise<any[]>;
    getWallet(driverId: string): Promise<{
        id: string;
        updatedAt: Date;
        driverId: string;
        balance: number;
        currency: string;
        lastTransactionAt: Date | null;
    }>;
}
