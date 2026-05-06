export declare class RideTrackingService {
    private readonly redis;
    private readonly logger;
    constructor(redis: any);
    updateDriverLocation(data: {
        driverId: string;
        rideId: string;
        lat: number;
        lng: number;
    }): Promise<{
        success: boolean;
    }>;
    getLastLocation(driverId: string): Promise<any>;
}
