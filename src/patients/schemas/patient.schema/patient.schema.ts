import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Patient extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  // 🔥 NEW FIELDS - Added for easier queries
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  bloodGroup: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  emergencyContactName: string;

  @Prop()
  emergencyContactPhone: string;

  @Prop([String])
  medicalConditions: string[];

  @Prop([String])
  allergies: string[];
}

export const PatientSchema = SchemaFactory.createForClass(Patient);