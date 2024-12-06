import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from './schemas/file.schema';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';

import {v4 as uuidv4} from 'uuid'

@Injectable()
export class StorageService {
  constructor(@InjectModel(File.name) private readonly fileModel: Model<File>) {}

  private uploadPath = join(__dirname, '..', '..', 'uploads');

  async saveFile(metadata: Partial<File>) {
    return (await this.fileModel.create(metadata)).path;
  }

  async uploadFromBuffer(buffer: Buffer): Promise<{ url: string }> {
    const filename = `${uuidv4()}.jpg`;
    const filePath = join(this.uploadPath, filename);

    try {
      await writeFile(filePath, buffer);
    } catch (err) {
      console.error(err)
    }

    const fileMetadata = await this.fileModel.create({
      filename,
      path: filePath,
      size: buffer.length,
      mimetype: 'image/jpg', // Указываем MIME-тип, если он известен
    });

    return { url: `/storage/${filename}` }; // Генерируем URL для доступа
  }

  async getFile(filename: string) {
    return await this.fileModel.findOne({ filename: filename }).exec();
  }

  async deleteFile(filename: string) {
    const file = await this.getFile(filename);
    if (file) {
      await unlink(file.path);
      await this.fileModel.deleteOne({ filename }).exec();
    }
  }
}
