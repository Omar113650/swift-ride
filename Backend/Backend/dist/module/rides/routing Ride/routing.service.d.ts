export declare class RoutingService {
    private readonly baseUrl;
    getRoute(pickup: {
        lat: number;
        lng: number;
    }, destination: {
        lat: number;
        lng: number;
    }): Promise<{
        distance: number;
        duration: number;
        polyline: any;
    }>;
}
