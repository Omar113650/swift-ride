export declare enum RideStatus {
    PENDING = "PENDING",
    BIDDING = "BIDDING",
    DRIVER_SELECTED = "DRIVER_SELECTED",
    DRIVER_ARRIVING = "DRIVER_ARRIVING",
    STARTED = "STARTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class CreateRideDto {
    rideId: string;
    pickupAddress: string;
    destinationAddress: string;
    note?: string;
    status: RideStatus;
}
