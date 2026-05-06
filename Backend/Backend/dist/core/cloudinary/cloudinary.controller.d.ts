import { CloudinaryService } from './cloudinary.service';
export declare class AppController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(file: Express.Multer.File, uploadId?: string): Promise<import("./cloudinary.service").CloudinaryResponse>;
    uploadImages(files: Express.Multer.File[]): Promise<import("./cloudinary.service").CloudinaryResponse[]>;
    deleteFile(publicId: string): Promise<unknown>;
}
