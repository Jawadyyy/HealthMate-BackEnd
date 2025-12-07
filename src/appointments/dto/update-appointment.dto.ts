import { ApiProperty } from '@nestjs/swagger';
import { AppointmentStatus } from '../schemas/appointment.schema/appointment.schema';

export class UpdateAppointmentDto {
  @ApiProperty({ enum: AppointmentStatus })
  status: AppointmentStatus;

  @ApiProperty({ required: false })
  notes?: string;
}
