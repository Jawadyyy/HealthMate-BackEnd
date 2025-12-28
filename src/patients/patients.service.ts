import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Patient } from './schemas/patient.schema/patient.schema';
import { CreatePatientDto } from './dto/create-patient.dto/create-patient.dto';
import { Model, Types } from 'mongoose';

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
  // GET LOGGED-IN PATIENT PROFILE
async getPatientByUser(userId: string) {
  console.log('✅ NEW CODE - Looking for patient with userId:', userId);
  
  // Use aggregation to bypass any auto-populate middleware
  const patients = await this.patientModel.aggregate([
    {
      $match: {
        $or: [
          { userId: new Types.ObjectId(userId) },
          { 'userId._id': userId }
        ]
      }
    },
    { $limit: 1 }
  ]);

  const patient = patients[0];
  
  console.log('✅ NEW CODE - Patient found:', patient ? 'YES' : 'NO');

  if (!patient) {
    throw new NotFoundException(
      'Patient profile not found. Please complete your profile first.'
    );
  }

  // If userId is still populated as object, replace it with just the ID
  if (patient.userId && typeof patient.userId === 'object' && patient.userId._id) {
    patient.userId = patient.userId._id;
  }

  return patient;
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
  // UPDATE PATIENT PROFILE
async updateProfile(userId: string, dto: CreatePatientDto) {
  console.log('✅ Updating profile for userId:', userId);
  
  try {
    // Use aggregation to find the patient document
    const existingPatients = await this.patientModel.aggregate([
      {
        $match: {
          $or: [
            { userId: new Types.ObjectId(userId) },
            { 'userId._id': userId }
          ]
        }
      },
      { $limit: 1 }
    ]);

    if (existingPatients.length > 0) {
      // Remove _id and __v from dto to prevent immutable field error
      const { _id, __v, createdAt, ...updateData } = dto as any;
      
      // Update using findByIdAndUpdate
      const updated = await this.patientModel
        .findByIdAndUpdate(
          existingPatients[0]._id,
          { 
            ...updateData,
            userId: new Types.ObjectId(userId) // Explicitly set userId as ObjectId
          },
          { new: true }
        )
        .lean()
        .exec();
      
      console.log('✅ Profile updated successfully');
      return updated;
    } else {
      // Create new profile
      console.log('✅ Creating new profile');
      const created = await this.patientModel.create({ 
        userId: new Types.ObjectId(userId), 
        ...dto 
      });
      return created.toObject();
    }
  } catch (error) {
    console.error('❌ Error in updateProfile:', error);
    throw error;
  }
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