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
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const cloudinary_service_1 = require("./cloudinary.service");
let AppController = class AppController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImage(file, uploadId) {
        if (!file) {
            throw new common_1.BadRequestException('File is required');
        }
        return this.cloudinaryService.uploadFile(file, uploadId);
    }
    async uploadImages(files) {
        if (!files || files.length === 0) {
            throw new common_1.BadRequestException('Files are required');
        }
        return this.cloudinaryService.uploadFiles(files);
    }
    async deleteFile(publicId) {
        if (!publicId) {
            throw new common_1.BadRequestException('publicId is required');
        }
        return this.cloudinaryService.deleteFile(publicId);
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Post)('image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('uploadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Post)('files'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files', 5, {
        limits: { fileSize: 10 * 1024 * 1024 },
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "uploadImages", null);
__decorate([
    (0, common_1.Delete)(':publicId'),
    __param(0, (0, common_1.Param)('publicId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "deleteFile", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [cloudinary_service_1.CloudinaryService])
], AppController);
//# sourceMappingURL=cloudinary.controller.js.map