export declare class RedisService {
    private readonly redis;
    constructor(redis: any);
    setCache(key: string, value: any, ttl?: number): Promise<void>;
    getCache(key: string): Promise<any>;
    deleteCache(key: string): Promise<void>;
}
