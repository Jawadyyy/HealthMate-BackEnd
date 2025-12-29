import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Schema({ timestamps: true })
export class Appointment extends Document {
  @Prop({ type: Types.ObjectId, required: true }) // Remove ref, just store the ObjectId
  patientId: Types.ObjectId; // This stores Patient.userId

  @Prop({ type: Types.ObjectId, required: true }) // Remove ref, just store the ObjectId
  doctorId: Types.ObjectId; // This stores Doctor.userId

  @Prop({ required: true })
  appointmentDate: Date;

  @Prop({ default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Prop()
  notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);