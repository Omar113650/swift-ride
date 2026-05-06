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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const api_features_1 = require("../../shared/utils/api-features");
let RatingService = class RatingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async addRate(dto, user) {
        const rate = await this.prisma.rating.create({
            data: {
                ...dto,
                raterId: user.id,
            },
        });
        return rate;
    }
    async getRatings(query) {
        const { userId, driverId, page = 1, limit = 10 } = query;
        return await this.prisma.rating.findMany({
            where: {
                userId: userId ?? undefined,
                driverId: driverId ?? undefined,
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getRatingById(id) {
        const rating = await this.prisma.rating.findUnique({
            where: { id },
        });
        if (!rating) {
            throw new common_1.NotFoundException('Rating not found');
        }
        return rating;
    }
    async updateRating(id, dto) {
        return await this.prisma.rating.update({
            where: { id },
            data: {
                score: dto.score,
                comment: dto.comment,
            },
        });
    }
    async deleteRating(id) {
        return await this.prisma.rating.delete({
            where: { id },
        });
    }
    async getTopRatedDrivers(query) {
        const result = await new api_features_1.PrismaApiFeatures(query)
            .filter()
            .sort()
            .paginate()
            .execute(this.prisma.rating);
        return result;
    }
};
exports.RatingService = RatingService;
exports.RatingService = RatingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RatingService);
//# sourceMappingURL=rating.service.js.map