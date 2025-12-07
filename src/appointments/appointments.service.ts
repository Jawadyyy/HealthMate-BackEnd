import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentStatus } from './schemas/appointment.schema/appointment.schema';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
  ) {}

  async create(patientId: string, dto: CreateAppointmentDto) {
    return this.appointmentModel.create({
      patientId,
      doctorId: dto.doctorId,
      appointmentDate: dto.appointmentDate,
      notes: dto.notes,
      status: AppointmentStatus.PENDING,
    });
  }

  async getAppointmentsByPatient(patientId: string) {
    return this.appointmentModel.find({ patientId }).populate('doctorId');
  }

  async getAppointmentsByDoctor(doctorId: string) {
    return this.appointmentModel.find({ doctorId }).populate('patientId');
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
}
