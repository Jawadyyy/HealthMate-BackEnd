// patients.service.ts
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

    // Convert string userId to ObjectId
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

    // Create with ObjectId userId - using fullName instead of name/email
    const newPatient = await this.patientModel.create({ 
      userId: userObjectId,
      fullName: dto.fullName,
      age: dto.age,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      phone: dto.phone,
      address: dto.address,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
      medicalConditions: dto.medicalConditions || []
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

    // Populate userId to get name and email from User collection
    const patient = await this.patientModel
      .findOne({ userId: userObjectId })
      .populate('userId', 'name email role')
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
    
    const userObjectId = new Types.ObjectId(userId);
    
    try {
      const existingPatient = await this.patientModel
        .findOne({ userId: userObjectId })
        .lean()
        .exec();

      if (existingPatient) {
        console.log('✅ Found existing patient, updating...');
        
        const updated = await this.patientModel
          .findByIdAndUpdate(
            existingPatient._id,
            { 
              fullName: dto.fullName,
              age: dto.age,
              gender: dto.gender,
              bloodGroup: dto.bloodGroup,
              phone: dto.phone,
              address: dto.address,
              emergencyContactName: dto.emergencyContactName,
              emergencyContactPhone: dto.emergencyContactPhone,
              medicalConditions: dto.medicalConditions || []
            },
            { new: true, runValidators: true }
          )
          .populate('userId', 'name email role')
          .lean()
          .exec();
        
        console.log('✅ Profile updated successfully');
        return updated;
      } else {
        console.log('✅ No existing profile found, creating new one...');
        const created = await this.patientModel.create({ 
          userId: userObjectId,
          fullName: dto.fullName,
          age: dto.age,
          gender: dto.gender,
          bloodGroup: dto.bloodGroup,
          phone: dto.phone,
          address: dto.address,
          emergencyContactName: dto.emergencyContactName,
          emergencyContactPhone: dto.emergencyContactPhone,
          medicalConditions: dto.medicalConditions || []
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