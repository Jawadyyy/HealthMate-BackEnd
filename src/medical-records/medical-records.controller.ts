import { 
  Controller, 
  Post, 
  Body, 
  Get, 
  Param, 
  Patch, 
  Delete, 
  UseGuards,
  Request,
  HttpStatus,
  HttpException
} from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@ApiTags("Medical Records")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post('add')
  @ApiOperation({})
  @ApiResponse({ status: 201, description: 'Record created successfully' })
  async addRecord(@Body() createRecordDto: CreateRecordDto, @Request() req) {
    try {
      if (req.user.role === 'doctor') {
        createRecordDto.doctorId = req.user.id;
      }

      const record = await this.medicalRecordsService.addRecord(createRecordDto);
      return {
        success: true,
        message: 'Medical record created successfully',
        data: record
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create medical record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('patient/:patientId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getRecordsByPatient(@Param('patientId') patientId: string, @Request() req) {
    try {
      if (req.user.role === 'patient' && req.user.id !== patientId) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      const records = await this.medicalRecordsService.getRecordsByPatient(patientId);
      return {
        success: true,
        data: records
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch medical records',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('all')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getAllRecords(@Request() req) {
    try {
      if (req.user.role === 'patient') {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      let records;
      if (req.user.role === 'doctor') {
        records = await this.medicalRecordsService.getRecordsByDoctor(req.user.id);
      } else if (req.user.role === 'admin') {
        records = await this.medicalRecordsService.getAllRecords();
      }

      return {
        success: true,
        data: records
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch medical records',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('my')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Records retrieved successfully' })
  async getMyRecords(@Request() req) {
    try {
      let records;
      
      if (req.user.role === 'patient') {
        records = await this.medicalRecordsService.getRecordsByPatient(req.user.id);
      } else if (req.user.role === 'doctor') {
        records = await this.medicalRecordsService.getRecordsByDoctor(req.user.id);
      } else {
        throw new HttpException('Invalid user role', HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: records
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch medical records',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':recordId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Record retrieved successfully' })
  async getRecordById(@Param('recordId') recordId: string, @Request() req) {
    try {
      const record = await this.medicalRecordsService.getRecordById(recordId);
      
      if (!record) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      if (req.user.role === 'patient' && record.patientId.toString() !== req.user.id) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      if (req.user.role === 'doctor' && record.doctorId.toString() !== req.user.id) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      return {
        success: true,
        data: record
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch medical record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('update/:recordId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Record updated successfully' })
  async updateRecord(
    @Param('recordId') recordId: string, 
    @Body() updateRecordDto: UpdateRecordDto,
    @Request() req
  ) {
    try {
      const existingRecord = await this.medicalRecordsService.getRecordById(recordId);
      
      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      if (req.user.role === 'doctor' && existingRecord.doctorId.toString() !== req.user.id) {
        throw new HttpException('Unauthorized to update this record', HttpStatus.FORBIDDEN);
      }

      const updatedRecord = await this.medicalRecordsService.updateRecord(recordId, updateRecordDto);
      
      return {
        success: true,
        message: 'Medical record updated successfully',
        data: updatedRecord
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update medical record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Delete('delete/:recordId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Record deleted successfully' })
  async deleteRecord(@Param('recordId') recordId: string, @Request() req) {
    try {
      const existingRecord = await this.medicalRecordsService.getRecordById(recordId);
      
      if (!existingRecord) {
        throw new HttpException('Record not found', HttpStatus.NOT_FOUND);
      }

      if (req.user.role === 'doctor' && existingRecord.doctorId.toString() !== req.user.id) {
        throw new HttpException('Unauthorized to delete this record', HttpStatus.FORBIDDEN);
      }

      if (req.user.role === 'patient') {
        throw new HttpException('Patients cannot delete medical records', HttpStatus.FORBIDDEN);
      }

      await this.medicalRecordsService.deleteRecord(recordId);
      
      return {
        success: true,
        message: 'Medical record deleted successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete medical record',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}