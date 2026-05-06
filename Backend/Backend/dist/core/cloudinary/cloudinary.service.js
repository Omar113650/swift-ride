"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const streamifier = __importStar(require("streamifier"));
let CloudinaryService = class CloudinaryService {
    cloudinary;
    constructor(cloudinary) {
        this.cloudinary = cloudinary;
    }
    uploadFile(file, uploadId) {
        return new Promise((resolve, reject) => {
            const upload_id = uploadId || (0, crypto_1.randomUUID)();
            const uploadStream = this.cloudinary.uploader.upload_stream({
                folder: 'uploads',
                chunk_size: 5_000_000,
                resource_type: 'auto',
                upload_id,
                transformation: [
                    {
                        fetch_format: 'webp',
                        quality: 'auto',
                    },
                ],
            }, (error, result) => {
                if (error)
                    return reject({ error, upload_id });
                resolve({
                    ...result,
                    upload_id,
                });
            });
            streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
    }
    async uploadFiles(files) {
        return Promise.all(files.map((f) => this.uploadFile(f)));
    }
    async deleteFile(publicId) {
        return new Promise((resolve, reject) => {
            this.cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error)
                    return reject(error);
                resolve(result);
            });
        });
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('CLOUDINARY')),
    __metadata("design:paramtypes", [Object])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map