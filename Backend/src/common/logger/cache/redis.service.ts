import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS') private readonly redis: any) {}

  async setCache(key: string, value: any, ttl = 300) {
    await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
  }

  async getCache(key: string) {
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }

  async deleteCache(key: string) {
    await this.redis.del(key);
  }
}
