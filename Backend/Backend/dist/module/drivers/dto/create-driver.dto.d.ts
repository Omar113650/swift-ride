export declare enum DriverStatus {
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    ON_RIDE = "ON_RIDE"
}
export declare class CreateDriverDto {
    licenseNumber: string;
    nationalId: string;
    status?: DriverStatus;
}
