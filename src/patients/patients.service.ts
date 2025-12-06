import { Injectable } from '@nestjs/common';
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
}
