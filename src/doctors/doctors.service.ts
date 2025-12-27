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
    return this.doctorModel.create({
      userId: new Types.ObjectId(userId),
      ...dto,
    });
  }

  // Get logged-in doctor's profile
  async getDoctorByUser(userId: string) {
    return this.doctorModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .populate('userId', 'name email role');
  }

  // Update doctor profile
  async update(userId: string, dto: UpdateDoctorDto) {
    return this.doctorModel
      .findOneAndUpdate(
        { userId: new Types.ObjectId(userId) },
        dto,
        { new: true },
      )
      .populate('userId', 'name email role');
  }

  // Get all doctors
  async getAllDoctors() {
    return this.doctorModel
      .find()
      .populate('userId', 'name email role');
  }

  // Get doctor by ID
  async getDoctorById(id: string) {
    const doctor = await this.doctorModel
      .findById(id)
      .populate('userId', 'name email role');

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
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
