// in docker

import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from '../../common/logger/cache/redis.service';
import * as dotenv from 'dotenv';

import 'dotenv/config';
dotenv.config();
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = createClient({
          username: process.env.USERNAME_REDIS,
          password: process.env.PASSWORD_REDIS,
          socket: {
            host: process.env.HOST_REDIS,
            // port: Number(process.env.PORT_REDIS!),
  port: process.env.PORT_REDIS
  ? parseInt(process.env.PORT_REDIS, 10)
  : 19539,
          },
        });

        client.on('error', (err) => console.log(' Redis Error:', err));

        await client.connect();

        console.log(' Redis Connected');

        return client;
      },
    },
    RedisService,
  ],
  exports: ['REDIS', RedisService],
})
export class RedisModule {}

//  to use
// import { Inject, Injectable } from '@nestjs/common';
// import { RedisClientType } from 'redis';

// @Injectable()
// export class BidsService {
//   constructor(@Inject('REDIS') private readonly redis: RedisClientType) {}

//   async test() {
//     await this.redis.set('test', 'redis');
//     return await this.redis.get('test');
//   }
// }
