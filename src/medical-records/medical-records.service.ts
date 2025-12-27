import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MedicalRecord } from './schemas/medical-record.schema/medical-record.schema';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    @InjectModel(MedicalRecord.name)
    private medicalRecordModel: Model<MedicalRecord>,
  ) {}

  async addRecord(createRecordDto: CreateRecordDto): Promise<MedicalRecord> {
    const newRecord = new this.medicalRecordModel({
      ...createRecordDto,
      date: createRecordDto.date || new Date(),
    });
    return await newRecord.save();
  }

  async getRecordsByPatient(patientId: string): Promise<MedicalRecord[]> {
  return await this.medicalRecordModel
    .find({ patientId })
    .populate('patientId', 'firstName lastName email name')
    .populate('doctorId', 'firstName lastName specialization name email phone hospital')
    .sort({ date: -1 })
    .exec();
}

  async getRecordsByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({ doctorId })
      .populate('patientId', 'firstName lastName email phoneNumber')
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ date: -1 })
      .exec();
  }

  async getAllRecords(): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find()
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialization')
      .sort({ date: -1 })
      .exec();
  }

  async getRecordById(recordId: string): Promise<MedicalRecord> {
    const record = await this.medicalRecordModel
      .findById(recordId)
      .populate('patientId', 'firstName lastName email phoneNumber')
      .populate('doctorId', 'firstName lastName specialization')
      .exec();

    if (!record) {
      throw new NotFoundException(`Medical record with ID ${recordId} not found`);
    }

    return record;
  }

  async updateRecord(recordId: string, updateRecordDto: UpdateRecordDto): Promise<MedicalRecord> {
    const updatedRecord = await this.medicalRecordModel
      .findByIdAndUpdate(recordId, updateRecordDto, { new: true })
      .populate('patientId', 'firstName lastName email')
      .populate('doctorId', 'firstName lastName specialization')
      .exec();

    if (!updatedRecord) {
      throw new NotFoundException(`Medical record with ID ${recordId} not found`);
    }

    return updatedRecord;
  }

  async deleteRecord(recordId: string): Promise<MedicalRecord> {
    const deletedRecord = await this.medicalRecordModel
      .findByIdAndDelete(recordId)
      .exec();

    if (!deletedRecord) {
      throw new NotFoundException(`Medical record with ID ${recordId} not found`);
    }

    return deletedRecord;
  }

  async getRecordsByType(patientId: string, type: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({ patientId, type })
      .sort({ date: -1 })
      .exec();
  }

  async getRecordsByStatus(status: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({ status })
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .sort({ date: -1 })
      .exec();
  }

  async getRecordsByDateRange(startDate: Date, endDate: Date): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .sort({ date: -1 })
      .exec();
  }

  async searchRecords(searchTerm: string): Promise<MedicalRecord[]> {
    return await this.medicalRecordModel
      .find({
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { diagnosis: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [new RegExp(searchTerm, 'i')] } }
        ]
      })
      .populate('patientId', 'firstName lastName')
      .populate('doctorId', 'firstName lastName')
      .sort({ date: -1 })
      .exec();
  }

  async getRecordsCount(): Promise<{ total: number; byType: any; byStatus: any }> {
    const total = await this.medicalRecordModel.countDocuments();
    
    const byType = await this.medicalRecordModel.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const byStatus = await this.medicalRecordModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return { total, byType, byStatus };
  }
}