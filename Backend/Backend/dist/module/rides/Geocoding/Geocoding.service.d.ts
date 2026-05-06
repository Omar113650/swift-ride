export declare class GeocodingService {
    getCoordinates(address: string): Promise<{
        lat: number;
        lng: number;
        displayName: any;
    }>;
}
