import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Doctor } from './schemas/doctor.schema/doctor.schema';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(Doctor.name)
    private doctorModel: Model<Doctor>,
  ) {}

  // Create doctor profile
  async create(userId: string, dto: CreateDoctorDto) {
  console.log('Received DTO:', dto);
  console.log('Fee value:', dto.fee);
  console.log('Fee type:', typeof dto.fee);
  
  const doctorData = {
    userId,
    ...dto
  };
  
  console.log('Doctor data to save:', doctorData);
  
  return this.doctorModel.create(doctorData);
}

  // Get doctor by userId
  async getDoctorByUser(userId: string) {
    return this.doctorModel.findOne({ userId: new Types.ObjectId(userId) });
  }

  // Update doctor profile
  async update(userId: string, dto: UpdateDoctorDto) {
    return this.doctorModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      dto,
      { new: true },
    );
  }

  // Get all doctors
  async getAllDoctors() {
    return this.doctorModel.find();
  }

  // Get doctor by ID
  async getDoctorById(id: string) {
    return this.doctorModel.findById(id);
  }

  // Delete doctor profile
  async deleteDoctor(id: string, userId: string, role: string) {
    const doctor = await this.doctorModel.findById(id);
    if (!doctor) throw new NotFoundException('Doctor not found');

    if (role !== 'admin' && !doctor.userId.equals(userId)) {
      throw new ForbiddenException(
        'You are not allowed to delete this profile',
      );
    }

    await this.doctorModel.findByIdAndDelete(id);

    return {
      message: 'Doctor profile deleted successfully',
      deletedId: id,
    };
  }
}
