import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsPositive } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  doctorId: string;

  @ApiProperty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}