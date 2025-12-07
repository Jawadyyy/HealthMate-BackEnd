import { ApiProperty } from "@nestjs/swagger";

export class CreateInvoiceDto {
  @ApiProperty()
  patientId: string;

  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  serviceName: string;

  @ApiProperty()
  amount: number;
}
