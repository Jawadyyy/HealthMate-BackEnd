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
  HttpException,
  Query
} from '@nestjs/common';
import { PrescriptionsService } from './prescriptions.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@ApiTags("Prescriptions")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prescriptions')
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post('create')
  @ApiOperation({})
  @ApiResponse({ status: 201, description: 'Prescription created successfully' })
  async createPrescription(
    @Body() createPrescriptionDto: CreatePrescriptionDto,
    @Request() req
  ) {
    try {
      if (req.user.role !== 'doctor') {
        throw new HttpException(
          'Only doctors can create prescriptions',
          HttpStatus.FORBIDDEN
        );
      }

      createPrescriptionDto.doctorId = req.user.id;

      const prescription = await this.prescriptionsService.createPrescription(
        createPrescriptionDto
      );

      return {
        success: true,
        message: 'Prescription created successfully',
        data: prescription
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to create prescription',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('doctor/my')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async getMyPrescriptions(@Request() req) {
    try {
      if (req.user.role !== 'doctor') {
        throw new HttpException(
          'Only doctors can access this endpoint',
          HttpStatus.FORBIDDEN
        );
      }

      const prescriptions = await this.prescriptionsService.getPrescriptionsByDoctor(
        req.user.id
      );

      return {
        success: true,
        data: prescriptions
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch prescriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('patient/:patientId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async getPrescriptionsByPatient(
    @Param('patientId') patientId: string,
    @Request() req
  ) {
    try {
      if (req.user.role === 'patient' && req.user.id !== patientId) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      const prescriptions = await this.prescriptionsService.getPrescriptionsByPatient(
        patientId
      );

      return {
        success: true,
        data: prescriptions
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch prescriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('my')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async getMyPrescriptionsAsPatient(@Request() req) {
    try {
      let prescriptions;

      if (req.user.role === 'patient') {
        prescriptions = await this.prescriptionsService.getPrescriptionsByPatient(
          req.user.id
        );
      } else if (req.user.role === 'doctor') {
        prescriptions = await this.prescriptionsService.getPrescriptionsByDoctor(
          req.user.id
        );
      } else {
        throw new HttpException('Invalid user role', HttpStatus.BAD_REQUEST);
      }

      return {
        success: true,
        data: prescriptions
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch prescriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('all')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescriptions retrieved successfully' })
  async getAllPrescriptions(@Request() req) {
    try {
      if (req.user.role !== 'admin') {
        throw new HttpException(
          'Only admins can access all prescriptions',
          HttpStatus.FORBIDDEN
        );
      }

      const prescriptions = await this.prescriptionsService.getAllPrescriptions();

      return {
        success: true,
        data: prescriptions
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch prescriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('search')
  @ApiOperation({})
  @ApiQuery({ name: 'q', required: true, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchPrescriptions(@Query('q') searchTerm: string, @Request() req) {
    try {
      if (!searchTerm) {
        throw new HttpException('Search term is required', HttpStatus.BAD_REQUEST);
      }

      const prescriptions = await this.prescriptionsService.searchPrescriptions(
        searchTerm
      );

      let filteredPrescriptions = prescriptions;
      if (req.user.role === 'patient') {
        filteredPrescriptions = prescriptions.filter(
          p => p.patientId && p.patientId.toString() === req.user.id
        );
      } else if (req.user.role === 'doctor') {
        filteredPrescriptions = prescriptions.filter(
          p => p.doctorId && p.doctorId.toString() === req.user.id
        );
      }

      return {
        success: true,
        data: filteredPrescriptions
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to search prescriptions',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':prescriptionId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescription retrieved successfully' })
  async getPrescriptionById(
    @Param('prescriptionId') prescriptionId: string,
    @Request() req
  ) {
    try {
      const prescription = await this.prescriptionsService.getPrescriptionById(
        prescriptionId
      );

      // Check if populated fields exist before accessing them
      if (!prescription.patientId || !prescription.doctorId) {
        throw new HttpException(
          'Prescription has missing patient or doctor information',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (req.user.role === 'patient' && 
          prescription.patientId._id.toString() !== req.user.id) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      if (req.user.role === 'doctor' && 
          prescription.doctorId._id.toString() !== req.user.id) {
        throw new HttpException('Unauthorized access', HttpStatus.FORBIDDEN);
      }

      return {
        success: true,
        data: prescription
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch prescription',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('update/:prescriptionId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescription updated successfully' })
  async updatePrescription(
    @Param('prescriptionId') prescriptionId: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
    @Request() req
  ) {
    try {
      if (req.user.role !== 'doctor') {
        throw new HttpException(
          'Only doctors can update prescriptions',
          HttpStatus.FORBIDDEN
        );
      }

      const existingPrescription = await this.prescriptionsService.getPrescriptionById(
        prescriptionId
      );

      if (!existingPrescription.doctorId) {
        throw new HttpException(
          'Prescription has missing doctor information',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (existingPrescription.doctorId._id.toString() !== req.user.id) {
        throw new HttpException(
          'Unauthorized to update this prescription',
          HttpStatus.FORBIDDEN
        );
      }

      const updatedPrescription = await this.prescriptionsService.updatePrescription(
        prescriptionId,
        updatePrescriptionDto
      );

      return {
        success: true,
        message: 'Prescription updated successfully',
        data: updatedPrescription
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to update prescription',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Patch('cancel/:prescriptionId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescription cancelled successfully' })
  async cancelPrescription(
    @Param('prescriptionId') prescriptionId: string,
    @Request() req
  ) {
    try {
      const prescription = await this.prescriptionsService.getPrescriptionById(
        prescriptionId
      );

      if (!prescription.doctorId) {
        throw new HttpException(
          'Prescription has missing doctor information',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (req.user.role === 'doctor' && 
          prescription.doctorId._id.toString() !== req.user.id) {
        throw new HttpException(
          'Unauthorized to cancel this prescription',
          HttpStatus.FORBIDDEN
        );
      }

      const cancelledPrescription = await this.prescriptionsService.cancelPrescription(
        prescriptionId
      );

      return {
        success: true,
        message: 'Prescription cancelled successfully',
        data: cancelledPrescription
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to cancel prescription',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('refill/:prescriptionId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Refill processed successfully' })
  async requestRefill(
    @Param('prescriptionId') prescriptionId: string,
    @Request() req
  ) {
    try {
      const prescription = await this.prescriptionsService.getPrescriptionById(
        prescriptionId
      );

      if (!prescription.patientId) {
        throw new HttpException(
          'Prescription has missing patient information',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (req.user.role === 'patient' && 
          prescription.patientId._id.toString() !== req.user.id) {
        throw new HttpException(
          'Unauthorized to request refill',
          HttpStatus.FORBIDDEN
        );
      }

      const updatedPrescription = await this.prescriptionsService.requestRefill(
        prescriptionId
      );

      return {
        success: true,
        message: 'Refill processed successfully',
        data: updatedPrescription
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to process refill',
        error.status || HttpStatus.BAD_REQUEST
      );
    }
  }

  @Delete(':prescriptionId')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Prescription deleted successfully' })
  async deletePrescription(
    @Param('prescriptionId') prescriptionId: string,
    @Request() req
  ) {
    try {
      if (req.user.role === 'patient') {
        throw new HttpException(
          'Patients cannot delete prescriptions',
          HttpStatus.FORBIDDEN
        );
      }

      const prescription = await this.prescriptionsService.getPrescriptionById(
        prescriptionId
      );

      if (!prescription.doctorId) {
        throw new HttpException(
          'Prescription has missing doctor information',
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }

      if (req.user.role === 'doctor' && 
          prescription.doctorId._id.toString() !== req.user.id) {
        throw new HttpException(
          'Unauthorized to delete this prescription',
          HttpStatus.FORBIDDEN
        );
      }

      await this.prescriptionsService.deletePrescription(prescriptionId);

      return {
        success: true,
        message: 'Prescription deleted successfully'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete prescription',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('stats/count')
  @ApiOperation({})
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  async getPrescriptionStats(@Request() req) {
    try {
      const stats = await this.prescriptionsService.getPrescriptionsCount();

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch statistics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}