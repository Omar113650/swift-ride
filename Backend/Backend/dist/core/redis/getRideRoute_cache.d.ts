export declare class RidesService {
    private readonly redis;
    private readonly prisma;
    constructor(redis: any, prisma: any);
    getRideRoute(rideId: string): Promise<any>;
}
