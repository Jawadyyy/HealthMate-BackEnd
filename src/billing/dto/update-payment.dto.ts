import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, IsOptional } from "class-validator";
import { PaymentStatus } from "../schemas/invoice.schema/invoice.schema";

export class UpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;
}