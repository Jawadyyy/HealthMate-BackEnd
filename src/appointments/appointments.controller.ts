import { Controller, Post, Body, Req, UseGuards, Get, Patch, Param } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Appointments")
@ApiBearerAuth()
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentService: AppointmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('book')
  bookAppointment(@Req() req, @Body() body: CreateAppointmentDto) {
    return this.appointmentService.create(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  getMyAppointments(@Req() req) {
    return this.appointmentService.getAppointmentsByPatient(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('doctor/:doctorId')
  getDoctorAppointments(@Param('doctorId') doctorId: string) {
    return this.appointmentService.getAppointmentsByDoctor(doctorId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  updateAppointment(@Param('id') id: string, @Body() body: UpdateAppointmentDto) {
    return this.appointmentService.update(id, body);
  }
  

  @UseGuards(JwtAuthGuard)
  @Patch('cancel/:id')
  cancelAppointment(@Param('id') id: string) {
    return this.appointmentService.cancel(id);
  }
}
