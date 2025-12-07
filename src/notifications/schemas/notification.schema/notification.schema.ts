import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

export enum NotificationType {
  APPOINTMENT = "appointment",
  PAYMENT = "payment",
  REPORT = "report",
  SYSTEM = "system"
}

@Schema({ timestamps: true })
export class Notification extends Document {

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId; // receiver

  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: NotificationType, default: NotificationType.SYSTEM })
  type: NotificationType;

  @Prop({ default: false })
  isRead: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
