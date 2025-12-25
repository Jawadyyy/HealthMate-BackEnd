import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsArray, ValidateNested, IsEnum, IsOptional, IsNumber, Min, IsDateString } from "class-validator";
import { Type } from "class-transformer";

class MedicationDto {
  @ApiProperty({ example: 'Amoxicillin' })
  @IsString()
  name: string;

  @ApiProperty({ example: '500mg' })
  @IsString()
  dosage: string;

  @ApiProperty({ example: 'Twice daily' })
  @IsString()
  frequency: string;

  @ApiProperty({ example: '7 days' })
  @IsString()
  duration: string;

  @ApiPropertyOptional({ example: 'Take with food' })
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class CreatePrescriptionDto {
  @ApiProperty({ description: 'Patient ID' })
  @IsString()
  patientId: string;

  @ApiPropertyOptional({ description: 'Doctor ID (auto-filled from auth)' })
  @IsOptional()
  @IsString()
  doctorId?: string;

  @ApiProperty({ type: [MedicationDto], description: 'List of medications' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  medications: MedicationDto[];

  @ApiProperty({ example: 'Type 2 Diabetes with Hypertension' })
  @IsString()
  diagnosis: string;

  @ApiPropertyOptional({ example: 'Patient should monitor blood sugar regularly' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Patient responding well to treatment' })
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ enum: ['active', 'completed', 'cancelled'], default: 'active' })
  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: string;

  @ApiProperty({ example: 2, description: 'Number of refills allowed' })
  @IsNumber()
  @Min(0)
  refills: number;

  @ApiPropertyOptional({ example: '2024-02-15' })
  @IsOptional()
  @IsDateString()
  nextRefillDate?: string;

  @ApiPropertyOptional({ example: '2024-01-15' })
  @IsOptional()
  @IsDateString()
  prescriptionDate?: string;

  @ApiPropertyOptional({ example: '2024-12-31' })
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}