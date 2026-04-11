import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        const client = createClient({
          username: 'default',
          password: 'SUXGVCHEhVfz2WdBMJ5ukPeJGK6PXdHz',
          socket: {
            host: 'redis-16295.c9.us-east-1-4.ec2.cloud.redislabs.com',
            port: 16295,
          },
        });

        client.on('error', (err) => console.log('Redis Error:', err));

        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}







