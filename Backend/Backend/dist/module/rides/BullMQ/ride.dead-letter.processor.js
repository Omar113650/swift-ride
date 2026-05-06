"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var RideDeadLetterConsumer_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideDeadLetterConsumer = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
let RideDeadLetterConsumer = RideDeadLetterConsumer_1 = class RideDeadLetterConsumer extends bullmq_1.WorkerHost {
    logger = new common_1.Logger(RideDeadLetterConsumer_1.name);
    async process(job) {
        this.logger.error(` DEAD LETTER JOB RECEIVED`);
        this.logger.error({
            job: job.name,
            data: job.data,
            failedReason: job.failedReason,
            attempts: job.attemptsMade,
            stack: job.stacktrace,
        });
        if (job.failedReason?.includes('Validation')) {
            this.logger.warn(' Skipping retry بسبب validation error');
            return { skipped: true };
        }
        if (job.attemptsMade < 3) {
            this.logger.warn(` Retrying job ${job.name}`);
            await job.retry();
            return { retried: true };
        }
        this.logger.error(`🚨 Job permanently failed: ${job.name}`);
        return { failed: true };
    }
};
exports.RideDeadLetterConsumer = RideDeadLetterConsumer;
exports.RideDeadLetterConsumer = RideDeadLetterConsumer = RideDeadLetterConsumer_1 = __decorate([
    (0, bullmq_1.Processor)('ride-dead-letter')
], RideDeadLetterConsumer);
//# sourceMappingURL=ride.dead-letter.processor.js.map