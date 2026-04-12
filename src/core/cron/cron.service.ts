// import { Injectable, Logger } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { PrismaService } from '../prisma/prisma.service';
// import { SocketService } from '../socket/socket.service';

// @Injectable()
// export class CronService {
//   private readonly logger = new Logger(CronService.name);

//   constructor(
//     private prisma: PrismaService,
//     private socketService: SocketService, // 🔥 هنا
//   ) {}

//   // ⏰ كل يوم 9 صباحًا
//   @Cron('0 9 * * *')
//   async sendDailyMotivation() {
//     this.logger.log('Running Daily Job 🚀');

//     const users = await this.prisma.user.findMany({
//       where: { isActive: true },
//     });

//     for (const user of users) {
//       // 🔥 هنا الاستخدام الصح
//       this.socketService.emitToDriver(user.id, 'daily_message', {
//         message: '🔥 ارجع اكمل رحلتك في Swift Ride',
//       });
//     }
//   }
// }
