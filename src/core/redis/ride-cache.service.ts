// import { Injectable, Inject } from '@nestjs/common';

// @Injectable()
// export class RideCacheService {
//   constructor(@Inject('REDIS') private readonly redis: any) {}

//   async get(key: string) {
//     const data = await this.redis.get(key);
//     return data ? JSON.parse(data) : null;
//   }

//   async set(key: string, value: any, ttl = 3600) {
//     await this.redis.set(key, JSON.stringify(value), {
//       EX: ttl,
//     });
//   }

//   async del(key: string) {
//     await this.redis.del(key);
//   }
// }