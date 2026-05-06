"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CronService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
const socket_service_1 = require("../socket/socket.service");
let CronService = CronService_1 = class CronService {
    prisma;
    socketService;
    logger = new common_1.Logger(CronService_1.name);
    constructor(prisma, socketService) {
        this.prisma = prisma;
        this.socketService = socketService;
    }
    س;
    async sendMarketingAds() {
        this.logger.log(' Running Marketing Ads ');
        try {
            const users = await this.prisma.user.findMany({
                where: { isActive: true },
                select: { id: true },
            });
            const message = this.getRandomAdMessage();
            for (const user of users) {
                this.logger.log(` Sending to user: ${user.id}`);
                this.socketService.emitToDriver(user.id, 'marketing_ad', {
                    message,
                });
            }
        }
        catch (error) { }
    }
    getRandomAdMessage() {
        const messages = [
            ' مستني إيه؟ ابدأ رحلتك دلوقتي مع Swift Ride وخد أفضل سعر!',
            ' اربح أكتر النهارده! افتح التطبيق وخد أقرب رحلة ليك فورًا',
            ' فرصة مش هتتعوض! رحلات كتير قريبة منك مستنياك',
            ' خلّي يومك productive… شغل وكمّل رحلاتك مع Swift Ride',
            ' اطلب رحلتك دلوقتي واستمتع بأسرع توصيل وأفضل خدمة',
            ' زوّد دخلك بسهولة! اقبل رحلات أكتر وحقق أرباح أعلى',
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    }
};
exports.CronService = CronService;
__decorate([
    (0, schedule_1.Cron)('0 9 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronService.prototype, "sendMarketingAds", null);
exports.CronService = CronService = CronService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_service_1.SocketService])
], CronService);
//# sourceMappingURL=cron.service.js.map