import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Doctor } from 'src/doctors/schemas/doctor.schema/doctor.schema';
import { Patient } from 'src/patients/schemas/patient.schema/patient.schema';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    @InjectModel(Patient.name) private patientModel: Model<Patient>,
    @InjectModel(Doctor.name) private doctorModel: Model<Doctor>,
  ) {}

  async create(patientUserId: string, dto: CreateAppointmentDto) {
    // 🔥 Find doctor by _id (from frontend), get their userId
    const doctor = await this.doctorModel.findById(dto.doctorId);
    if (!doctor) throw new NotFoundException('Doctor not found');

    return this.appointmentModel.create({
      patientId: new Types.ObjectId(patientUserId), // ✅ Store patient's userId
      doctorId: doctor.userId, // ✅ Store doctor's userId (not _id)
      appointmentDate: dto.appointmentDate,
      notes: dto.notes,
      status: AppointmentStatus.PENDING,
    });
  }

  async getAppointmentsByPatient(patientUserId: string) {
    const appointments = await this.appointmentModel.find({ 
      patientId: new Types.ObjectId(patientUserId) 
    });
    
    // Manual populate since we're not using refs
    const populatedAppointments = await Promise.all(
      appointments.map(async (appt) => {
        const doctor = await this.doctorModel.findOne({ userId: appt.doctorId });
        return {
          ...appt.toObject(),
          doctorId: doctor, // Replace ObjectId with full doctor object
        };
      })
    );
    
    return populatedAppointments;
  }

  async getAppointmentsByDoctor(doctorUserId: string) {
  const appointments = await this.appointmentModel.find({ 
    doctorId: new Types.ObjectId(doctorUserId) 
  });
  
  // Manual populate - NOW MUCH SIMPLER!
  const populatedAppointments = await Promise.all(
    appointments.map(async (appt) => {
      const patient = await this.patientModel.findOne({ userId: appt.patientId });
      
      return {
        ...appt.toObject(),
        patientId: patient ? {
          _id: patient._id,
          name: patient.fullName, 
        } : {
          _id: appt.patientId,
          name: 'Patient',
        }
      };
    })
  );
  
  return populatedAppointments;
}

  async update(appointmentId: string, dto: UpdateAppointmentDto) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      dto,
      { new: true },
    );
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async cancel(appointmentId: string) {
    const appointment = await this.appointmentModel.findByIdAndUpdate(
      appointmentId,
      { status: AppointmentStatus.CANCELLED },
      { new: true },
    );
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async deleteAppointment(id: string) {
    const appt = await this.appointmentModel.findById(id);
    if (!appt) throw new NotFoundException('Appointment not found');
    return this.appointmentModel.deleteOne({ _id: id });
  }
}