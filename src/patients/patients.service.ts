import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
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

  // CREATE PATIENT
  async create(userId: string, dto: CreatePatientDto) {
    return this.patientModel.create({ userId, ...dto });
  }

  // GET LOGGED-IN PATIENT PROFILE
  async getPatientByUser(userId: string) {
    return this.patientModel
      .findOne({ userId })
      .populate('userId', 'name email role');
  }

  // GET ALL PATIENTS (ADMIN)
  async getAllPatients() {
    return this.patientModel
      .find()
      .populate('userId', 'name email role');
  }

  // GET PATIENT BY ID
  async getPatientById(id: string, userId: string, role: string) {
    const patient = await this.patientModel
      .findById(id)
      .populate('userId', 'name email role');

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (
      role !== 'admin' &&
      role !== 'doctor' &&
      !patient.userId['_id'].equals(userId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this profile',
      );
    }

    return patient;
  }

  // UPDATE PATIENT PROFILE
  async updateProfile(userId: string, dto: CreatePatientDto) {
    const updated = await this.patientModel
      .findOneAndUpdate({ userId }, dto, { new: true })
      .populate('userId', 'name email role');

    if (!updated) {
      throw new NotFoundException('Profile not found');
    }

    return updated;
  }

  // DELETE PATIENT PROFILE
  async deletePatient(id: string, userId: string, role: string) {
    const patient = await this.patientModel.findById(id);

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (
      role !== 'admin' &&
      role !== 'doctor' &&
      !patient.userId.equals(userId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to delete this profile',
      );
    }

    await this.patientModel.findByIdAndDelete(id);

    return {
      message: 'Patient profile deleted successfully',
      deletedId: id,
    };
  }
}
