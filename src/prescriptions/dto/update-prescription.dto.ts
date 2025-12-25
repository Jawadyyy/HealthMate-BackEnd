import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsArray, ValidateNested, IsEnum, IsOptional, IsNumber, Min, IsDateString } from "class-validator";
import { Type } from "class-transformer";

class MedicationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dosage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  frequency?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  instructions?: string;
}

export class UpdatePrescriptionDto {
  @ApiPropertyOptional({ type: [MedicationDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MedicationDto)
  medications?: MedicationDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  doctorNotes?: string;

  @ApiPropertyOptional({ enum: ['active', 'completed', 'cancelled'] })
  @IsOptional()
  @IsEnum(['active', 'completed', 'cancelled'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  refills?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  refillsUsed?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  nextRefillDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}