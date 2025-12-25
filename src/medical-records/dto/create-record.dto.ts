import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsEnum, IsDateString, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";

class VitalSignsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bloodPressure?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  heartRate?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperature?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  weight?: number;
}

class AttachmentDto {
  @ApiProperty()
  @IsString()
  fileName: string;

  @ApiProperty()
  @IsString()
  fileUrl: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileType?: string;
}

export class CreateRecordDto {
  @ApiProperty()
  @IsString()
  patientId: string;

  @ApiProperty()
  @IsString()
  doctorId: string;

  @ApiProperty({ enum: ['consultation', 'lab-report', 'diagnosis', 'vaccination', 'prescription', 'surgery', 'other'] })
  @IsEnum(['consultation', 'lab-report', 'diagnosis', 'vaccination', 'prescription', 'surgery', 'other'])
  type: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsString()
  diagnosis: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  treatment?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  prescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  @ApiPropertyOptional({ enum: ['active', 'archived', 'pending'], default: 'active' })
  @IsOptional()
  @IsEnum(['active', 'archived', 'pending'])
  status?: string;

  @ApiPropertyOptional({ type: VitalSignsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => VitalSignsDto)
  vitalSigns?: VitalSignsDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  visitDate?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}