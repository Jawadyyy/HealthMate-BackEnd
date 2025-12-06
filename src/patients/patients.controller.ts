import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto/create-patient.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Patients")
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
}
