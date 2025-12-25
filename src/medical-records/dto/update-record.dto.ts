import { ApiPropertyOptional } from "@nestjs/swagger";
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
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  fileType?: string;
}

export class UpdateRecordDto {
  @ApiPropertyOptional({ enum: ['consultation', 'lab-report', 'diagnosis', 'vaccination', 'prescription', 'surgery', 'other'] })
  @IsOptional()
  @IsEnum(['consultation', 'lab-report', 'diagnosis', 'vaccination', 'prescription', 'surgery', 'other'])
  type?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  diagnosis?: string;

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

  @ApiPropertyOptional({ enum: ['active', 'archived', 'pending'] })
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