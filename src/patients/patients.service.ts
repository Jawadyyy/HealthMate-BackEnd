import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
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
    console.log('✅ Creating patient with userId (string):', userId);
    console.log('✅ Creating patient with dto:', dto);

    // ⚠️ CRITICAL FIX: Convert string userId to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    console.log('✅ Converted to ObjectId:', userObjectId);

    // Check if patient already exists
    const existingPatient = await this.patientModel.findOne({ 
      userId: userObjectId 
    }).lean();

    if (existingPatient) {
      console.log('❌ Patient already exists for this user');
      throw new ConflictException('Patient profile already exists for this user');
    }

    // Create with ObjectId userId
    const newPatient = await this.patientModel.create({ 
      userId: userObjectId, // Use ObjectId instead of string
      ...dto 
    });

    console.log('✅ Patient created successfully:', newPatient);
    return newPatient;
  }

  // GET LOGGED-IN PATIENT PROFILE
  async getPatientByUser(userId: string) {
    console.log('✅ Looking for patient with userId (string):', userId);
    
    // Convert string to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    console.log('✅ Converted to ObjectId:', userObjectId);

    // Simple findOne with ObjectId - no need for complex aggregation
    const patient = await this.patientModel
      .findOne({ userId: userObjectId })
      .lean()
      .exec();

    console.log('✅ Patient found:', patient ? 'YES' : 'NO');

    if (!patient) {
      throw new NotFoundException(
        'Patient profile not found. Please complete your profile first.'
      );
    }

    return patient;
  }

  // GET ALL PATIENTS (ADMIN)
  async getAllPatients() {
    return this.patientModel
      .find()
      .populate('userId', 'name email role')
      .lean()
      .exec();
  }

  // GET PATIENT BY ID
  async getPatientById(id: string, userId: string, role: string) {
    const patient = await this.patientModel
      .findById(id)
      .populate('userId', 'name email role')
      .lean()
      .exec();

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Type assertion for populated userId
    const populatedUserId = patient.userId as any;

    if (
      role !== 'admin' &&
      role !== 'doctor' &&
      populatedUserId._id.toString() !== userId
    ) {
      throw new ForbiddenException(
        'You are not allowed to view this profile',
      );
    }

    return patient;
  }

  // UPDATE PATIENT PROFILE
  async updateProfile(userId: string, dto: CreatePatientDto) {
    console.log('✅ Updating profile for userId:', userId);
    
    // Convert string to ObjectId
    const userObjectId = new Types.ObjectId(userId);
    
    try {
      // Find existing patient
      const existingPatient = await this.patientModel
        .findOne({ userId: userObjectId })
        .lean()
        .exec();

      if (existingPatient) {
        console.log('✅ Found existing patient, updating...');
        
        // Update existing patient
        const updated = await this.patientModel
          .findByIdAndUpdate(
            existingPatient._id,
            { 
              ...dto,
              userId: userObjectId // Ensure userId stays as ObjectId
            },
            { new: true, runValidators: true }
          )
          .lean()
          .exec();
        
        console.log('✅ Profile updated successfully');
        return updated;
      } else {
        // Create new profile if doesn't exist
        console.log('✅ No existing profile found, creating new one...');
        const created = await this.patientModel.create({ 
          userId: userObjectId, 
          ...dto 
        });
        
        console.log('✅ Profile created successfully');
        return created.toObject();
      }
    } catch (error) {
      console.error('❌ Error in updateProfile:', error);
      throw error;
    }
  }

  // DELETE PATIENT PROFILE
  async deletePatient(id: string, userId: string, role: string) {
    const patient = await this.patientModel
      .findById(id)
      .lean()
      .exec();

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    // Convert both to strings for comparison
    if (
      role !== 'admin' &&
      role !== 'doctor' &&
      patient.userId.toString() !== userId
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