import { Controller, Get, Param, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('total-patients')
  totalPatients() {
    return this.analyticsService.totalPatients();
  }

  @Get('total-doctors')
  totalDoctors() {
    return this.analyticsService.totalDoctors();
  }

  @Get('appointments')
  appointmentStats() {
    return this.analyticsService.appointmentStats();
  }

  @Get('revenue')
  revenueSummary() {
    return this.analyticsService.revenueSummary();
  }

  @Get('top-doctors')
  topDoctors(@Query('limit') limit: string) {
    return this.analyticsService.topDoctors(Number(limit) || 5);
  }

  @Get('patient-trend/:patientId')
  patientMedicalRecordTrend(@Param('patientId') patientId: string) {
    return this.analyticsService.patientMedicalRecordTrend(patientId);
  }

  // === New Endpoints ===
  @Get('patient-adherence/:patientId')
  patientAdherence(@Param('patientId') patientId: string) {
    return this.analyticsService.patientMissedAppointments(patientId);
  }

  @Get('disease-trends')
  diseaseTrends(@Query('limit') limit: string) {
    return this.analyticsService.diseaseTrends(Number(limit) || 5);
  }
}
