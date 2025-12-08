import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecord } from './schemas/medical-record.schema/medical-record.schema';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecord>,
  ) {}

  async addRecord(data: any) {
    const newRecord = new this.medicalRecordModel(data);
    return newRecord.save();
  }

  async getRecordsByPatient(patientId: string) {
    return this.medicalRecordModel.find({ patientId });
  }

  async updateRecord(recordId: string, updatedData: any) {
    return this.medicalRecordModel.findByIdAndUpdate(recordId, updatedData, { new: true });
  }

  async deleteRecord(recordId: string) {
    return this.medicalRecordModel.findByIdAndDelete(recordId);
  }
}
