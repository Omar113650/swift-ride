import { PrismaService } from '../../core/prisma/prisma.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
import { SocketService } from '../../core/socket/socket.service';
export declare class RideBidService {
    private readonly prisma;
    private socketService;
    constructor(prisma: PrismaService, socketService: SocketService);
    createBid(createRideBidDto: CreateRideBidDto, driverId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    }>;
    updateBid(bidId: string, updateDto: UpdateRideBidDto, driverUserId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    }>;
    deleteBid(bidId: string, driverId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    }>;
    getBidsForRide(rideId: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    }[]>;
    selectBid(rideId: string, bidId: string): Promise<{
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
    }>;
}
