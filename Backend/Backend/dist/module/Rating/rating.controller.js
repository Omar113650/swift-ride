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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingController = void 0;
const common_1 = require("@nestjs/common");
const rating_service_1 = require("./rating.service");
const rate_dto_1 = require("./dto/rate.dto");
const throttler_1 = require("@nestjs/throttler");
let RatingController = class RatingController {
    ratingService;
    constructor(ratingService) {
        this.ratingService = ratingService;
    }
    addRate(dto, req) {
        return this.ratingService.addRate(dto, req.user);
    }
    getRatings(userId, driverId, page, limit) {
        return this.ratingService.getRatings({
            userId,
            driverId,
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 10,
        });
    }
    getRatingById(id) {
        return this.ratingService.getRatingById(id);
    }
    updateRating(id, dto) {
        return this.ratingService.updateRating(id, dto);
    }
    deleteRating(id) {
        return this.ratingService.deleteRating(id);
    }
    getTopRatedDrivers(query) {
        return this.ratingService.getTopRatedDrivers(query);
    }
};
exports.RatingController = RatingController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [rate_dto_1.CreateRatingDto, Object]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "addRate", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('driverId')),
    __param(2, (0, common_1.Query)('page')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "getRatings", null);
__decorate([
    (0, common_1.UseGuards)(throttler_1.ThrottlerGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "getRatingById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "updateRating", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "deleteRating", null);
__decorate([
    (0, common_1.Get)('top-rated'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RatingController.prototype, "getTopRatedDrivers", null);
exports.RatingController = RatingController = __decorate([
    (0, common_1.Controller)('rating'),
    __metadata("design:paramtypes", [rating_service_1.RatingService])
], RatingController);
//# sourceMappingURL=rating.controller.js.map