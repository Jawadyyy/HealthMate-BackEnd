import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded"
}

@Schema({ timestamps: true })
export class Invoice extends Document {

  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Doctor', required: true })
  doctorId: Types.ObjectId;

  @Prop({ required: true })
  serviceName: string;  // e.g. "Consultation"

  @Prop({ required: true })
  amount: number;

  @Prop({ default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ required: false })
  paymentMethod: string; // e.g. "Cash", "Card", "Online"

  @Prop()
  transactionId?: string; 
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
