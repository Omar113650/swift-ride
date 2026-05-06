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
exports.RideBidController = void 0;
const common_1 = require("@nestjs/common");
const bids_service_1 = require("./bids.service");
const create_bid_dto_1 = require("./dto/create-bid.dto");
const update_bid_dto_1 = require("./dto/update-bid.dto");
const roles_decorator_1 = require("../../core/decorators/roles.decorator");
const roles_guard_1 = require("../../core/guards/roles.guard");
let RideBidController = class RideBidController {
    rideBidService;
    constructor(rideBidService) {
        this.rideBidService = rideBidService;
    }
    async createBid(dto, req) {
        console.log('USER FROM REQUEST:', req.User);
        const driverId = req.User?.sub;
        if (!driverId) {
            return {
                message: 'User not found in request',
            };
        }
        return this.rideBidService.createBid(dto, driverId);
    }
    async updateBid(bidId, dto, req) {
        const driverUserId = req.User?.sub;
        if (!driverUserId) {
            throw new common_1.UnauthorizedException('User not found in request');
        }
        return this.rideBidService.updateBid(bidId, dto, driverUserId);
    }
    async deleteBid(bidId, req) {
        const driverId = req.user.id;
        return this.rideBidService.deleteBid(bidId, driverId);
    }
    async getBidsForRide(rideId) {
        return this.rideBidService.getBidsForRide(rideId);
    }
    async selectBid(rideId, bidId) {
        return this.rideBidService.selectBid(rideId, bidId);
    }
};
exports.RideBidController = RideBidController;
__decorate([
    (0, common_1.Post)('add-bids'),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('RIDER', 'DRIVER', 'ADMIN'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bid_dto_1.CreateRideBidDto, Object]),
    __metadata("design:returntype", Promise)
], RideBidController.prototype, "createBid", null);
__decorate([
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('RIDER', 'DRIVER', 'ADMIN'),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_bid_dto_1.UpdateRideBidDto, Object]),
    __metadata("design:returntype", Promise)
], RideBidController.prototype, "updateBid", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RideBidController.prototype, "deleteBid", null);
__decorate([
    (0, common_1.Get)('ride/:rideId'),
    __param(0, (0, common_1.Param)('rideId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RideBidController.prototype, "getBidsForRide", null);
__decorate([
    (0, common_1.Patch)('ride/:rideId/select/:bidId'),
    __param(0, (0, common_1.Param)('rideId')),
    __param(1, (0, common_1.Param)('bidId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RideBidController.prototype, "selectBid", null);
exports.RideBidController = RideBidController = __decorate([
    (0, common_1.Controller)('bids'),
    __metadata("design:paramtypes", [bids_service_1.RideBidService])
], RideBidController);
//# sourceMappingURL=bids.controller.js.map