export declare enum RaterType {
    USER = "USER",
    DRIVER = "DRIVER"
}
export declare class CreateRatingDto {
    userId?: string;
    driverId?: string;
    raterType: RaterType;
    score: number;
    comment?: string;
}
