import { ApiProperty } from "@nestjs/swagger";

export class CreateRecordDto {
  @ApiProperty()
  patientId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty()
  diagnosis?: string;

  @ApiProperty()
  prescription?: string;

  @ApiProperty()
  reportUrl?: string;

  @ApiProperty()
  visitDate?: Date;
}
