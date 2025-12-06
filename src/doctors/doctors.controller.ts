import { Controller, Post, Body, Req, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Doctors")
@ApiBearerAuth()
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  createDoctor(@Req() req, @Body() body: CreateDoctorDto) {
    return this.doctorsService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyProfile(@Req() req) {
    return this.doctorsService.getDoctorByUser(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  updateProfile(@Req() req, @Body() body: UpdateDoctorDto) {
    return this.doctorsService.update(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  getAllDoctors() {
    return this.doctorsService.getAllDoctors();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getDoctorById(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }
}
