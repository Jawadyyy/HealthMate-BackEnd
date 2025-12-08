import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Appointment } from '../appointments/schemas/appointment.schema/appointment.schema';
import { Invoice } from '../billing/schemas/invoice.schema/invoice.schema';
import { MedicalRecord } from '../medical-records/schemas/medical-record.schema/medical-record.schema';
import { Doctor } from '../doctors/schemas/doctor.schema/doctor.schema';
import { Patient } from '../patients/schemas/patient.schema/patient.schema';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(MedicalRecord.name) private medicalRecordModel: Model<MedicalRecord>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
  ) {}

  async totalPatients() {
    return this.patientModel.countDocuments();
  }

  async totalDoctors() {
    return this.doctorModel.countDocuments();
  }

  async appointmentStats() {
    const total = await this.appointmentModel.countDocuments();
    const pending = await this.appointmentModel.countDocuments({ status: 'pending' });
    const confirmed = await this.appointmentModel.countDocuments({ status: 'confirmed' });
    const cancelled = await this.appointmentModel.countDocuments({ status: 'cancelled' });
    const completed = await this.appointmentModel.countDocuments({ status: 'completed' });

    return { total, pending, confirmed, cancelled, completed };
  }

  async revenueSummary() {
    const invoices = await this.invoiceModel.find({ status: 'paid' });
    const totalRevenue = invoices.reduce((sum, i) => sum + i.amount, 0);
    return { totalRevenue, paidInvoices: invoices.length };
  }

  async topDoctors(limit = 5) {
    const result = await this.appointmentModel.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: "$doctorId", appointments: { $sum: 1 } } },
      { $sort: { appointments: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "doctors",
          localField: "_id",
          foreignField: "_id",
          as: "doctor"
        }
      },
      { $unwind: "$doctor" },
      { $project: { doctorName: "$doctor.fullName", specialization: "$doctor.specialization", appointments: 1 } }
    ]);

    return result;
  }

  async patientMedicalRecordTrend(patientId: string) {
    const result = await this.medicalRecordModel.aggregate([
      { $match: { patientId: patientId } },
      {
        $group: {
          _id: { $month: "$visitDate" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    return result; 
  }
}
