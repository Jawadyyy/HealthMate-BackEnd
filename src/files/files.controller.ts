import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Res,
  StreamableFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags("Files")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req
  ) {
    const uploadedFile = await this.filesService.uploadFile(file, req.user.id);

    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileId: uploadedFile._id,
        fileName: uploadedFile.fileName,
        fileUrl: uploadedFile.fileUrl,
        originalName: uploadedFile.originalName,
      }
    };
  }

  @Get(':fileId')
  async getFile(@Param('fileId') fileId: string) {
    const file = await this.filesService.getFileById(fileId);
    return {
      success: true,
      data: file
    };
  }

  @Get('download/:fileId')
  async downloadFile(
    @Param('fileId') fileId: string,
    @Res({ passthrough: true }) res: Response
  ) {
    const { stream, file } = await this.filesService.getFileStream(fileId);

    res.set({
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
    });

    return new StreamableFile(stream);
  }

  @Delete(':fileId')
  async deleteFile(@Param('fileId') fileId: string) {
    await this.filesService.deleteFile(fileId);
    return {
      success: true,
      message: 'File deleted successfully'
    };
  }
}