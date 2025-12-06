import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty()
  age: number;

  @ApiProperty()
  gender: string;

  @ApiProperty()
  bloodGroup: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  emergencyContactName: string;

  @ApiProperty()
  emergencyContactPhone: string;

  @ApiProperty({ type: [String] })
  medicalConditions: string[];
}
