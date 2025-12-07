import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  diagnosis: string;

  @Prop()
  prescription: string;

  @Prop()
  reportUrl: string;

  @Prop({ type: Date })
  visitDate: Date;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
