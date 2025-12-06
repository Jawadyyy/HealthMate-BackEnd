import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Doctor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  fullName: string;

  @Prop()
  specialization: string;

  @Prop()
  degrees: string;

  @Prop()
  phone: string;

  @Prop()
  hospitalName: string;

  @Prop()
  experienceYears: number;

  @Prop({ default: [] })
  availableSlots: string[];
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
