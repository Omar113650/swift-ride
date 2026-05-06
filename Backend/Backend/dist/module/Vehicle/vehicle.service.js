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
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../core/prisma/prisma.service");
const cloudinary_service_1 = require("../../core/cloudinary/cloudinary.service");
let VehicleService = class VehicleService {
    prisma;
    cloudinaryService;
    constructor(prisma, cloudinaryService) {
        this.prisma = prisma;
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImage(image) {
        if (!image)
            return undefined;
        const result = await this.cloudinaryService.uploadFile(image);
        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    }
    async ensureDriverExists(driverId) {
        const driver = await this.prisma.driver.findUnique({
            where: { id: driverId },
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return driver;
    }
    async ensureUniquePlate(plateNumber, excludeId) {
        const existing = await this.prisma.vehicle.findUnique({
            where: { plateNumber },
        });
        if (existing && existing.id !== excludeId) {
            throw new common_1.ConflictException('Plate number already exists');
        }
    }
    async addVehicle(dto, driverId, image) {
        await this.ensureDriverExists(driverId);
        await this.ensureUniquePlate(dto.plateNumber);
        const imageData = await this.uploadImage(image);
        return this.prisma.vehicle.create({
            data: {
                ...dto,
                image: imageData?.url,
                imagePublicId: imageData?.publicId,
                driverId,
            },
        });
    }
    async getVehicles(driverId) {
        const vehicles = this.prisma.vehicle.findMany({ where: { driverId } });
        if (!vehicles) {
            throw new common_1.NotFoundException('not found any vehicles');
        }
        return vehicles;
    }
    async getVehicleById(id) {
        const vehicle = await this.prisma.vehicle.findUnique({
            where: { id },
        });
        if (!vehicle) {
            throw new common_1.NotFoundException('Vehicle not found');
        }
        return vehicle;
    }
    async deleteVehicle(id) {
        const vehicle = await this.getVehicleById(id);
        if (vehicle.imagePublicId) {
            await this.cloudinaryService.deleteFile(vehicle.imagePublicId);
        }
        await this.prisma.vehicle.delete({
            where: { id },
        });
        return { message: 'Vehicle deleted successfully' };
    }
    async updateVehicle(id, dto, image) {
        const vehicle = await this.getVehicleById(id);
        if (dto.plateNumber) {
            await this.ensureUniquePlate(dto.plateNumber, id);
        }
        let imageData;
        if (image) {
            if (vehicle.imagePublicId) {
                await this.cloudinaryService.deleteFile(vehicle.imagePublicId);
            }
            imageData = await this.uploadImage(image);
        }
        return this.prisma.vehicle.update({
            where: { id },
            data: {
                ...dto,
                ...(imageData && {
                    image: imageData.url,
                    imagePublicId: imageData.publicId,
                }),
            },
        });
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map