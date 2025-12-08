import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MedicalRecord extends Document {

  @Prop({ required: true })
  patientId: string;

  @Prop({ required: true })
  doctorId: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop()
  treatment?: string;

  @Prop()
  prescription?: string;

  @Prop()
  visitDate: Date;
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);
