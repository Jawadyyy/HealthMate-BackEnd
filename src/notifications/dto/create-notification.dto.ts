import { ApiProperty } from "@nestjs/swagger";
import { NotificationType } from "../schemas/notification.schema/notification.schema";

export class CreateNotificationDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ enum: NotificationType, required: false })
  type?: NotificationType;
}
