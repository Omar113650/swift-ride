// import { Module } from '@nestjs/common';
// import { CustomLoggerService } from './custom-logger.service';
// import * as winston from 'winston';
// import { WinstonModule } from 'nest-winston';
// // @Module({
// //   providers: [CustomLoggerService],
// //   exports: [CustomLoggerService],
// // })
// // export class LoggerModule {}





// // 🧠 الخلاصة (احفظها كده)
// // ✔️ أبسط Setup:
// // Logger (built-in)
// // ✔️ متوسط:
// // Custom Logger
// // Interceptor
// // ✔️ Pro:
// // Correlation ID
// // Exception Filter
// // ✔️ Enterprise:
// // Winston / Pino
// // Logging to files + services


// @Module({
//   imports: [
//     WinstonModule.forRoot({
//       transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//       ],
//     }),
//   ],
// })
// export class LoggerModule {}








// nestjs-pino (أسرع وأحدث)
// أو
// winston (أشهر وأقدم)