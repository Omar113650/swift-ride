import { RideBidService } from './bids.service';
import { CreateRideBidDto } from './dto/create-bid.dto';
import { UpdateRideBidDto } from './dto/update-bid.dto';
export declare class RideBidController {
    private readonly rideBidService;
    constructor(rideBidService: RideBidService);
    createBid(dto: CreateRideBidDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    } | {
        message: string;
    }>;
    updateBid(bidId: string, dto: UpdateRideBidDto, req: any): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.BidStatus;
        driverId: string;
        rideId: string;
        price: number;
        arrivalTime: number;
        isSelected: boolean;
    }>;
    deleteBid(bidId: string, req: any): Promise<{
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
