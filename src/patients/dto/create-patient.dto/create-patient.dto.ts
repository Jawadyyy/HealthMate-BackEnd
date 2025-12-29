// dto/create-patient.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional, Min, Max } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({ })
  @IsString()
  fullName: string;

  @ApiProperty({ example: 25 })
  @IsNumber()
  @Min(0)
  @Max(150)
  age: number;

  @ApiProperty({ })
  @IsString()
  gender: string;

  @ApiProperty({  })
  @IsString()
  bloodGroup: string;

  @ApiProperty({ })
  @IsString()
  phone: string;

  @ApiProperty({ })
  @IsString()
  address: string;

  @ApiProperty({ })
  @IsString()
  emergencyContactName: string;

  @ApiProperty({ })
  @IsString()
  emergencyContactPhone: string;

  @ApiProperty({ type: [String], example: ['Asthma', 'Diabetes'], required: false })
  @IsArray()
  @IsOptional()
  medicalConditions?: string[];
}