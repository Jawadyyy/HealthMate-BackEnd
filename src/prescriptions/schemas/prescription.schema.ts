import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Embedded schema for medications
class Medication {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dosage: string;

  @Prop({ required: true })
  frequency: string;

  @Prop({ required: true })
  duration: string;

  @Prop()
  instructions?: string;
}

@Schema({ timestamps: true })
export class Prescription extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ type: [Medication], required: true })
  medications: Medication[];

  @Prop({ required: true })
  diagnosis: string;

  @Prop()
  notes?: string;

  @Prop()
  doctorNotes?: string;

  @Prop({ 
    enum: ['active', 'completed', 'cancelled'], 
    default: 'active' 
  })
  status: string;

  @Prop({ required: true, default: 0 })
  refills: number;

  @Prop({ default: 0 })
  refillsUsed: number;

  @Prop()
  nextRefillDate?: Date;

  @Prop({ required: true, default: Date.now })
  prescriptionDate: Date;

  @Prop()
  expiryDate?: Date;
}

export const PrescriptionSchema = SchemaFactory.createForClass(Prescription);