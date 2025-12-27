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
  // CHANGE 'Patient' to 'User'
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  patientId: Types.ObjectId;

  // CHANGE 'Doctor' to 'User'  
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
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

  @Prop()
  diagnosis?: string; // Made optional since not all records need diagnosis

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