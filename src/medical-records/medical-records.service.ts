import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { MedicalRecord } from './schemas/medical-record.schema/medical-record.schema';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecord>,
  ) {}

  async create(doctorId: string, dto: CreateRecordDto) {
    return this.medicalRecordModel.create({
      ...dto,
      doctorId,
    });
  }

  async getPatientRecords(patientId: string) {
    return this.medicalRecordModel
      .find({ patientId })
      .populate('doctorId', 'name specialization');
  }

  async update(recordId: string, dto: UpdateRecordDto) {
    const record = await this.medicalRecordModel.findByIdAndUpdate(recordId, dto, { new: true });
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }

  async delete(recordId: string) {
    const record = await this.medicalRecordModel.findByIdAndDelete(recordId);
    if (!record) throw new NotFoundException('Record not found');
    return record;
  }
}
