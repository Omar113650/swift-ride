// import { Injectable } from '@nestjs/common';
// import { v2 as cloudinary } from 'cloudinary';
// import { randomUUID } from 'crypto';
// import * as streamifier from 'streamifier';

// export interface CloudinaryResponse {
//   url: string;
//   public_id: string;
//   upload_id?: string;
//   [key: string]: any;
// }

// @Injectable()
// export class CloudinaryService {
//   uploadFile(
//     file: Express.Multer.File,
//     uploadId?: string,
//   ): Promise<CloudinaryResponse> {
//     return new Promise<CloudinaryResponse>((resolve, reject) => {
//       const upload_id = uploadId || randomUUID();

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: 'uploads',
//           chunk_size: 5_000_000,
//           resource_type: 'auto',
//           upload_id,
//           transformation: [
//             {
//               fetch_format: 'webp',
//               quality: 'auto',
//             },
//           ],
//         },
//         (error, result) => {
//           if (error) {
//             return reject({ error, upload_id });
//           }

//           resolve({
//             ...(result as CloudinaryResponse),
//             upload_id,
//           });
//         },
//       );

//       streamifier.createReadStream(file.buffer).pipe(uploadStream);
//     });
//   }

//   async uploadFiles(
//     files: Express.Multer.File[],
//   ): Promise<CloudinaryResponse[]> {
//     if (!files || files.length === 0) {
//       throw new Error('No files provided');
//     }

//     const uploadPromises = files.map((file) => this.uploadFile(file));

//     return Promise.all(uploadPromises);
//   }

//   async deleteFile(publicId: string): Promise<any> {
//     return new Promise((resolve, reject) => {
//       cloudinary.uploader.destroy(publicId, (error, result) => {
//         if (error) {
//           return reject(error);
//         }
//         resolve(result);
//       });
//     });
//   }
// }








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