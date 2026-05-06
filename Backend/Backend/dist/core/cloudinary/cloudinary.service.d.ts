import { v2 as cloudinary } from 'cloudinary';
type CloudinaryType = typeof cloudinary;
export interface CloudinaryResponse {
    url: string;
    public_id: string;
    upload_id?: string;
    [key: string]: any;
}
export declare class CloudinaryService {
    private readonly cloudinary;
    constructor(cloudinary: CloudinaryType);
    uploadFile(file: Express.Multer.File, uploadId?: string): Promise<CloudinaryResponse>;
    uploadFiles(files: Express.Multer.File[]): Promise<CloudinaryResponse[]>;
    deleteFile(publicId: string): Promise<unknown>;
}
export {};
