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
exports.RideBidService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const socket_service_1 = require("../../core/socket/socket.service");
let RideBidService = class RideBidService {
    prisma;
    socketService;
    constructor(prisma, socketService) {
        this.prisma = prisma;
        this.socketService = socketService;
    }
    async createBid(createRideBidDto, driverId) {
        const ride = await this.prisma.ride.findUnique({
            where: { id: createRideBidDto.rideId },
        });
        if (!ride) {
            throw new common_1.NotFoundException('Ride not found');
        }
        const driver = await this.prisma.driver.findUnique({
            where: { userId: driverId },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        const bidsCount = await this.prisma.rideBid.count({
            where: {
                rideId: ride.id,
                driverId: driver.id,
            },
        });
        if (bidsCount >= 3) {
            throw new common_1.BadRequestException('Max bids reached');
        }
        const newBid = await this.prisma.rideBid.create({
            data: {
                ...createRideBidDto,
                driverId: driver.id,
            },
        });
        this.socketService.emitToUser(ride.riderId, 'new_bid', {
            rideId: ride.id,
            bidId: newBid.id,
            driverId: driver.id,
            price: newBid.price,
            message: ' New driver bid received',
        });
        return newBid;
    }
    async updateBid(bidId, updateDto, driverUserId) {
        const bid = await this.prisma.rideBid.findUnique({
            where: { id: bidId },
        });
        if (!bid) {
            throw new common_1.NotFoundException('Bid not found');
        }
        const driver = await this.prisma.driver.findUnique({
            where: { userId: driverUserId },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        if (bid.driverId !== driver.id) {
            throw new common_1.BadRequestException('Cannot update others bid');
        }
        if (bid.isSelected) {
            throw new common_1.BadRequestException('Cannot update selected bid');
        }
        const updatedBid = await this.prisma.rideBid.update({
            where: { id: bidId },
            data: updateDto,
        });
        return updatedBid;
    }
    async deleteBid(bidId, driverId) {
        const bid = await this.prisma.rideBid.findUnique({ where: { id: bidId } });
        if (!bid)
            throw new common_1.NotFoundException('Bid not found');
        if (bid.driverId !== driverId)
            throw new common_1.BadRequestException('Cannot delete others bid');
        if (bid.isSelected)
            throw new common_1.BadRequestException('Cannot delete selected bid');
        const deletedBid = await this.prisma.rideBid.delete({
            where: { id: bidId },
        });
        return deletedBid;
    }
    async getBidsForRide(rideId) {
        const ride = await this.prisma.ride.findUnique({
            where: { id: rideId },
            include: { rideBids: true },
        });
        if (!ride)
            throw new common_1.NotFoundException('Ride not found');
        return ride.rideBids;
    }
    async selectBid(rideId, bidId) {
        const bid = await this.prisma.rideBid.findUnique({ where: { id: bidId } });
        if (!bid)
            throw new common_1.NotFoundException('Bid not found');
        if (bid.rideId !== rideId)
            throw new common_1.BadRequestException('Bid does not belong to this ride');
        const ride = await this.prisma.ride.update({
            where: { id: rideId },
            data: {
                driverId: bid.driverId,
                selectedPrice: bid.price,
                status: 'DRIVER_SELECTED',
            },
        });
        await this.prisma.rideBid.update({
            where: { id: bidId },
            data: { isSelected: true, status: 'ACCEPTED' },
        });
        await this.prisma.rideBid.updateMany({
            where: { rideId, id: { not: bidId } },
            data: { status: 'REJECTED' },
        });
        return ride;
    }
};
exports.RideBidService = RideBidService;
exports.RideBidService = RideBidService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        socket_service_1.SocketService])
], RideBidService);
//# sourceMappingURL=bids.service.js.map