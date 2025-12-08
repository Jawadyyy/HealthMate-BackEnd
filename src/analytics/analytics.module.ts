import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Appointment, AppointmentSchema } from '../appointments/schemas/appointment.schema/appointment.schema';
import { Invoice, InvoiceSchema } from '../billing/schemas/invoice.schema/invoice.schema';
import { MedicalRecord, MedicalRecordSchema } from '../medical-records/schemas/medical-record.schema/medical-record.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema/doctor.schema';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema/patient.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: MedicalRecord.name, schema: MedicalRecordSchema }]),
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    AuthModule
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
})
export class AnalyticsModule {}
