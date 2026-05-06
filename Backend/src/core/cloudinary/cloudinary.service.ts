import { Injectable, Inject } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { randomUUID } from 'crypto';
import * as streamifier from 'streamifier';

type CloudinaryType = typeof cloudinary;

export interface CloudinaryResponse {
  url: string;
  public_id: string;
  upload_id?: string;
  [key: string]: any;
}

@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: CloudinaryType,
  ) {}

  uploadFile(
    file: Express.Multer.File,
    uploadId?: string,
  ): Promise<CloudinaryResponse> {
    return new Promise((resolve, reject) => {
      const upload_id = uploadId || randomUUID();

      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
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
        },
        (error, result) => {
          if (error) return reject({ error, upload_id });

          resolve({
            ...(result as CloudinaryResponse),
            upload_id,
          });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  async uploadFiles(files: Express.Multer.File[]) {
    return Promise.all(files.map((f) => this.uploadFile(f)));
  }

  async deleteFile(publicId: string) {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
