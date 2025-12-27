import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Prescription } from './schemas/prescription.schema';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Injectable()
export class PrescriptionsService {
  constructor(
    @InjectModel(Prescription.name)
    private prescriptionModel: Model<Prescription>,
  ) {}

  async createPrescription(createPrescriptionDto: CreatePrescriptionDto): Promise<Prescription> {
    // Set default prescription date if not provided
    const prescriptionData = {
      ...createPrescriptionDto,
      prescriptionDate: createPrescriptionDto.prescriptionDate || new Date(),
      refillsUsed: 0
    };

    // Calculate expiry date if not provided (default 1 year)
    if (!prescriptionData.expiryDate) {
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      prescriptionData.expiryDate = expiryDate.toISOString();
    }

    const newPrescription = new this.prescriptionModel(prescriptionData);
    const savedPrescription = await newPrescription.save();
    
    // Populate after saving to return complete data
    const populatedPrescription = await this.prescriptionModel
      .findById(savedPrescription._id)
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .exec();

    if (!populatedPrescription) {
      throw new NotFoundException('Failed to retrieve created prescription');
    }

    return populatedPrescription;
  }

  async getPrescriptionsByDoctor(doctorId: string): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({ doctorId })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async getPrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({ patientId })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async getPrescriptionById(prescriptionId: string): Promise<Prescription> {
    const prescription = await this.prescriptionModel
      .findById(prescriptionId)
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .exec();

    if (!prescription) {
      throw new NotFoundException(`Prescription with ID ${prescriptionId} not found`);
    }

    return prescription;
  }

  async getAllPrescriptions(): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find()
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async updatePrescription(
    prescriptionId: string, 
    updatePrescriptionDto: UpdatePrescriptionDto
  ): Promise<Prescription> {
    const updatedPrescription = await this.prescriptionModel
      .findByIdAndUpdate(prescriptionId, updatePrescriptionDto, { new: true })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .exec();

    if (!updatedPrescription) {
      throw new NotFoundException(`Prescription with ID ${prescriptionId} not found`);
    }

    return updatedPrescription;
  }

  async deletePrescription(prescriptionId: string): Promise<Prescription> {
    const deletedPrescription = await this.prescriptionModel
      .findByIdAndDelete(prescriptionId)
      .exec();

    if (!deletedPrescription) {
      throw new NotFoundException(`Prescription with ID ${prescriptionId} not found`);
    }

    return deletedPrescription;
  }

  async cancelPrescription(prescriptionId: string): Promise<Prescription> {
    return await this.updatePrescription(prescriptionId, { status: 'cancelled' });
  }

  async completePrescription(prescriptionId: string): Promise<Prescription> {
    return await this.updatePrescription(prescriptionId, { status: 'completed' });
  }

  async requestRefill(prescriptionId: string): Promise<Prescription> {
    const prescription = await this.getPrescriptionById(prescriptionId);

    // Check if refills are available
    if (prescription.refillsUsed >= prescription.refills) {
      throw new BadRequestException('No refills remaining for this prescription');
    }

    // Check if prescription has expired
    if (prescription.expiryDate && new Date(prescription.expiryDate) < new Date()) {
      throw new BadRequestException('Prescription has expired');
    }

    // Check if prescription is active
    if (prescription.status !== 'active') {
      throw new BadRequestException('Prescription is not active');
    }

    // Increment refills used
    return await this.updatePrescription(prescriptionId, {
      refillsUsed: prescription.refillsUsed + 1
    });
  }

  // Utility methods

  async getPrescriptionsByStatus(status: string): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({ status })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async getActivePrescriptionsByPatient(patientId: string): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({ patientId, status: 'active' })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async getExpiredPrescriptions(): Promise<Prescription[]> {
    const now = new Date();
    return await this.prescriptionModel
      .find({
        expiryDate: { $lt: now },
        status: 'active'
      })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .exec();
  }

  async getPrescriptionsNeedingRefill(): Promise<Prescription[]> {
    const now = new Date();
    return await this.prescriptionModel
      .find({
        status: 'active',
        nextRefillDate: { $lte: now },
        $expr: { $lt: ['$refillsUsed', '$refills'] }
      })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .exec();
  }

  async searchPrescriptions(searchTerm: string): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({
        $or: [
          { diagnosis: { $regex: searchTerm, $options: 'i' } },
          { notes: { $regex: searchTerm, $options: 'i' } },
          { 'medications.name': { $regex: searchTerm, $options: 'i' } }
        ]
      })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }

  async getPrescriptionsCount(): Promise<{ 
    total: number; 
    byStatus: any; 
    byDoctor: any; 
  }> {
    const total = await this.prescriptionModel.countDocuments();
    
    const byStatus = await this.prescriptionModel.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const byDoctor = await this.prescriptionModel.aggregate([
      { $group: { _id: '$doctorId', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    return { total, byStatus, byDoctor };
  }

  async getPrescriptionsByDateRange(
    startDate: Date, 
    endDate: Date
  ): Promise<Prescription[]> {
    return await this.prescriptionModel
      .find({
        prescriptionDate: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('patientId', 'name email role')
      .populate('doctorId', 'name email role')
      .sort({ prescriptionDate: -1 })
      .exec();
  }
}