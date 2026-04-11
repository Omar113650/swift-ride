// import { Global, Module } from '@nestjs/common';
// import { ElasticsearchModule } from '@nestjs/elasticsearch';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Global()
// @Module({
//   imports: [
//     ElasticsearchModule.registerAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (config: ConfigService) => ({
//         node: config.get('ELASTICSEARCH_URL', 'http://localhost:9200'),
//         maxRetries: 3,
//         requestTimeout: 5000,
//       }),
//     }),
//   ],
//   exports: [ElasticsearchModule],
// })
// export class AppElasticsearchModule {}











