import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsPositive, IsOptional } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiProperty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}