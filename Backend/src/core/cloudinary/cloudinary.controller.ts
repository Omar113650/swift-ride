import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Body,
  Delete,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class AppController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  
  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('uploadId') uploadId?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    return this.cloudinaryService.uploadFile(file, uploadId);
  }


  @Post('files')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB لكل ملف
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Files are required');
    }

    return this.cloudinaryService.uploadFiles(files);
  }

  @Delete(':publicId')
  async deleteFile(@Param('publicId') publicId: string) {
    if (!publicId) {
      throw new BadRequestException('publicId is required');
    }

    return this.cloudinaryService.deleteFile(publicId);
  }
}
