import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsMongoId, IsPositive } from "class-validator";

export class CreateInvoiceDto {
  @ApiProperty()
  @IsMongoId()
  patientId: string;

  @ApiProperty()
  @IsMongoId()
  doctorId: string;

  @ApiProperty()
  @IsString()
  serviceName: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  amount: number;
}