import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorDto {
  @ApiProperty()
  fullName: string;

  @ApiProperty()
  specialization: string;

  @ApiProperty()
  degrees: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  hospitalName: string;

  @ApiProperty()
  experienceYears: number;

  @ApiProperty()
  fee: number;

  @ApiProperty({
    type: [String],
  })
  availableDays: string[];

  @ApiProperty({
    type: [String],})
  availableSlots?: string[];
}
