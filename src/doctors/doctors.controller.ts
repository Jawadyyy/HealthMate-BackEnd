import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  Get,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Doctors')
@ApiBearerAuth()
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  // Create doctor profile
  @UseGuards(JwtAuthGuard)
  @Post('create')
  createDoctor(@Req() req, @Body() body: CreateDoctorDto) {
    // req.user.id is the authenticated user's ObjectId string
    return this.doctorsService.create(req.user.id, body);
  }

  // Get logged-in doctor's profile
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req) {
    return this.doctorsService.getDoctorByUser(req.user.id);
  }

  // Update logged-in doctor's profile
  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateProfile(@Req() req, @Body() body: UpdateDoctorDto) {
    return this.doctorsService.update(req.user.id, body);
  }

  // Get all doctors
  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllDoctors() {
    return this.doctorsService.getAllDoctors();
  }

  // Get doctor by ID
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  // Delete doctor profile
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteDoctor(@Param('id') id: string, @Req() req) {
    return this.doctorsService.deleteDoctor(
      id,
      req.user.id,
      req.user.role,
    );
  }
}
