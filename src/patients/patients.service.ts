import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Patient } from './schemas/patient.schema/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto/create-patient.dto';

@Injectable()
export class PatientsService {
  constructor(
    @InjectModel(Patient.name)
    private patientModel: Model<Patient>,
  ) {}

  async create(userId: string, dto: CreatePatientDto) {
    return this.patientModel.create({ userId, ...dto });
  }

  async getPatientByUser(userId: string) {
    return this.patientModel.findOne({ userId });
  }

  async getAllPatients() {
    return this.patientModel.find();
  }

  async getPatientById(id: string, userId: string, role: string) {
    const patient = await this.patientModel.findById(id);
    if (!patient) throw new NotFoundException('Patient not found');

    if (role !== 'admin' && role !== 'doctor' && !patient.userId.equals(userId)) {
      throw new ForbiddenException('You are not allowed to view this profile');
    }


    return patient;
  }

  async updateProfile(userId: string, dto: CreatePatientDto) {
    const updated = await this.patientModel.findOneAndUpdate(
      { userId },
      dto,
      { new: true },
    );
    if (!updated) throw new NotFoundException('Profile not found');
    return updated;
  }
}
