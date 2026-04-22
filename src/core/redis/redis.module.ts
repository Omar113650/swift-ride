// in docker 

import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import{RedisService} from '../../common/logger/cache/redis.service'


@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = createClient({
          username: 'default',
          password: 'JTH64LWaQ8Hr1bBsc9s8G1FJUbx61jXq',
          socket: {
            host: 'redis-19539.c16.us-east-1-2.ec2.cloud.redislabs.com',
            port: 19539,
          },
        });

        client.on('error', (err) =>
          console.log(' Redis Error:', err),
        );

        await client.connect();

        console.log(' Redis Connected');

        return client;
      },
      
    },
    RedisService
  ],
  exports: ['REDIS',RedisService],
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