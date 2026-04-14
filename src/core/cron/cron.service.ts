import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private socketService: SocketService,
  ) {}
// دي كل دقيقه
// @Cron('* * * * *')
@Cron('0 9 * * *')
async sendMarketingAds() {
  this.logger.log('📢 Running Marketing Ads Job...');

  try {
    const users = await this.prisma.user.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    const message = this.getRandomAdMessage();

    // 👇 اطبع الرسالة هنا
    this.logger.log(`📨 Ad Message: ${message}`);

    for (const user of users) {
      this.logger.log(`➡️ Sending to user: ${user.id}`);

      this.socketService.emitToDriver(user.id, 'marketing_ad', {
        message,
      });
    }

    this.logger.log('✅ Ads sent successfully');
  } catch (error) {
    this.logger.error('❌ Error sending ads', error);
  }
}

  // 🎯 رسائل دعائية احترافية
  private getRandomAdMessage(): string {
    const messages = [
      '🚗🔥 مستني إيه؟ ابدأ رحلتك دلوقتي مع Swift Ride وخد أفضل سعر!',
      '💰 اربح أكتر النهارده! افتح التطبيق وخد أقرب رحلة ليك فورًا',
      '⚡ فرصة مش هتتعوض! رحلات كتير قريبة منك مستنياك',
      '🎯 خلّي يومك productive… شغل وكمّل رحلاتك مع Swift Ride',
      '🔥 اطلب رحلتك دلوقتي واستمتع بأسرع توصيل وأفضل خدمة',
      '🚀 زوّد دخلك بسهولة! اقبل رحلات أكتر وحقق أرباح أعلى',
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }
}