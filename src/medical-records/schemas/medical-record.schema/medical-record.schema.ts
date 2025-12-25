import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class VitalSigns {
  @Prop()
  bloodPressure?: string;

  @Prop()
  heartRate?: number;

  @Prop()
  temperature?: number;

  @Prop()
  weight?: number;
}

class Attachment {
  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileUrl: string;

  @Prop()
  fileType?: string;

  @Prop({ default: Date.now })
  uploadedAt: Date;
}

@Schema({ timestamps: true })
export class MedicalRecord extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ 
    required: true, 
    enum: ['consultation', 'lab-report', 'diagnosis', 'vaccination', 'prescription', 'surgery', 'other']
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  diagnosis: string;

  @Prop()
  treatment?: string;

  @Prop()
  prescription?: string;

  @Prop()
  notes?: string;

  @Prop({ type: [Attachment], default: [] })
  attachments: Attachment[];

  @Prop({ 
    enum: ['active', 'archived', 'pending'], 
    default: 'active' 
  })
  status: string;

  @Prop({ type: VitalSigns })
  vitalSigns?: VitalSigns;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop()
  visitDate?: Date;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const MedicalRecordSchema = SchemaFactory.createForClass(MedicalRecord);