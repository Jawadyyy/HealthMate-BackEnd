import { ApiProperty } from "@nestjs/swagger";
import { PaymentStatus } from "../schemas/invoice.schema/invoice.schema";

export class UpdatePaymentDto {
  @ApiProperty({ enum: PaymentStatus })
  status: PaymentStatus;

  @ApiProperty({ required: false })
  paymentMethod?: string;

  @ApiProperty({ required: false })
  transactionId?: string;
}
