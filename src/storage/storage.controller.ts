import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Response } from 'express';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }
    await this.storageService.saveFile({
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    });
    return { url: `/storage/${file.filename}` };
  }


  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const file = await this.storageService.getFile(filename);
    if (!file) {
      throw new HttpException('File not found', HttpStatus.NOT_FOUND);
    }
    res.sendFile(file.path);
  }

  @Delete(':filename')
  async deleteFile(@Param('filename') filename: string) {
    await this.storageService.deleteFile(filename);
    return { message: 'File deleted successfully' };
  }
}
