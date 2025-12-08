import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Medical Records")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post('add')
  addRecord(@Body() body: any) {
    return this.medicalRecordsService.addRecord(body);
  }

  @Get('patient/:patientId')
  getRecords(@Param('patientId') patientId: string) {
    return this.medicalRecordsService.getRecordsByPatient(patientId);
  }

  @Patch('update/:recordId')
  updateRecord(@Param('recordId') recordId: string, @Body() body: any) {
    return this.medicalRecordsService.updateRecord(recordId, body);
  }

  @Delete('delete/:recordId')
  deleteRecord(@Param('recordId') recordId: string) {
    return this.medicalRecordsService.deleteRecord(recordId);
  }
}
