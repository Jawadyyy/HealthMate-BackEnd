import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Analytics")
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('total-patients')
  totalPatients() {
    return this.analyticsService.totalPatients();
  }

  @UseGuards(JwtAuthGuard)
  @Get('total-doctors')
  totalDoctors() {
    return this.analyticsService.totalDoctors();
  }

  @UseGuards(JwtAuthGuard)
  @Get('appointments')
  appointmentStats() {
    return this.analyticsService.appointmentStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get('revenue')
  revenueSummary() {
    return this.analyticsService.revenueSummary();
  }

  @UseGuards(JwtAuthGuard)
  @Get('top-doctors')
  topDoctors(@Query('limit') limit?: number) {
    return this.analyticsService.topDoctors(limit ? +limit : undefined);
  }

  @UseGuards(JwtAuthGuard)
  @Get('patient-trend/:patientId')
  patientMedicalRecordTrend(@Param('patientId') patientId: string) {
    return this.analyticsService.patientMedicalRecordTrend(patientId);
  }
}
