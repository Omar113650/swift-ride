// import { Global, Module } from '@nestjs/common';
// import { createClient } from 'redis';

// @Global()
// @Module({
//   providers: [
//     {
//       provide: 'REDIS',
//       useFactory: async () => {
//         const client = createClient({
//           username: 'default',
//           password: 'SUXGVCHEhVfz2WdBMJ5ukPeJGK6PXdHz',
//           socket: {
//             host: 'redis-16295.c9.us-east-1-4.ec2.cloud.redislabs.com',
//             port: 16295,
//           },
//         });

//         client.on('error', (err) => console.log('Redis Error:', err));

//         await client.connect();
//         return client;
//       },
//     },
//   ],
//   exports: ['REDIS'],
// })
// export class RedisModule {}









// انا عملت ب طريقيتن 


// in docker 


import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import{RideGateway} from './ride.gateway'
@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        client.on('error', (err) =>
          console.log('Redis Error:', err),
        );

        await client.connect();
        return client;
      },
    },

    RideGateway
  ],
  exports: ['REDIS'],

})
export class RedisModule {}




//  to use

// import { Inject, Injectable } from '@nestjs/common';
// import { RedisClientType } from 'redis';

// @Injectable()
// export class BidsService {
//   constructor(@Inject('REDIS') private readonly redis: RedisClientType) {}

//   async test() {
//     await this.redis.set('test', 'hello redis 🚀');
//     return await this.redis.get('test');
//   }
// }