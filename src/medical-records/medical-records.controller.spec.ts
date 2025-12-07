import { Controller, Post, Body, Req, UseGuards, Get, Param, Patch, Delete } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags("Medical Records")
@ApiBearerAuth()
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private recordsService: MedicalRecordsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  addMedicalRecord(@Req() req, @Body() body: CreateRecordDto) {
    return this.recordsService.create(req.user.id, body); 
  }

  @UseGuards(JwtAuthGuard)
  @Get('patient/:patientId')
  getPatientRecords(@Param('patientId') patientId: string) {
    return this.recordsService.getPatientRecords(patientId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:recordId')
  updateRecord(@Param('recordId') recordId: string, @Body() body: UpdateRecordDto) {
    return this.recordsService.update(recordId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:recordId')
  deleteRecord(@Param('recordId') recordId: string) {
    return this.recordsService.delete(recordId);
  }
}

