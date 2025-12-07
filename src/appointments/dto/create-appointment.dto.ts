import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @ApiProperty()
  doctorId: string;

  @ApiProperty()
  appointmentDate: Date;

  @ApiProperty({ required: false })
  notes?: string;
}
