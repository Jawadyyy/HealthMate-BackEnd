import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from './schemas/file.schema';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  constructor(
    @InjectModel(File.name)
    private fileModel: Model<File>,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<File> {
    // Generate unique filename
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join('uploads', uniqueFileName);
    const fileUrl = `/uploads/${uniqueFileName}`;

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Save to database
    const newFile = new this.fileModel({
      fileName: uniqueFileName,
      originalName: file.originalname,
      fileUrl: fileUrl,
      filePath: filePath,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedBy: userId,
    });

    return await newFile.save();
  }

  async getFileById(fileId: string): Promise<File> {
    const file = await this.fileModel.findById(fileId).exec();
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async deleteFile(fileId: string): Promise<void> {
    const file = await this.getFileById(fileId);
    
    // Delete physical file
    if (fs.existsSync(file.filePath)) {
      fs.unlinkSync(file.filePath);
    }

    // Delete from database
    await this.fileModel.findByIdAndDelete(fileId);
  }

  async getFileStream(fileId: string): Promise<{ stream: fs.ReadStream; file: File }> {
    const file = await this.getFileById(fileId);
    
    if (!fs.existsSync(file.filePath)) {
      throw new NotFoundException('File not found on disk');
    }

    const stream = fs.createReadStream(file.filePath);
    return { stream, file };
  }
}