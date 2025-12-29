// patients.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles_decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createPatient(@Req() req, @Body() body: CreatePatientDto) {
    return this.patientsService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyPatientProfile(@Req() req) {
    return this.patientsService.getPatientByUser(req.user.id);
  }

  @Get('all')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getAllPatients() {
    return this.patientsService.getAllPatients();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getPatientById(@Param('id') id: string, @Req() req) {
    return this.patientsService.getPatientById(
      id,
      req.user.id,
      req.user.role,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateProfile(@Req() req, @Body() dto: CreatePatientDto) {
    return this.patientsService.updateProfile(req.user.id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deletePatient(@Param('id') id: string, @Req() req) {
    return this.patientsService.deletePatient(id, req.user.id, req.user.role);
  }
}