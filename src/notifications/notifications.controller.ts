import { Controller, Post, Body, Get, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { JwtAuthGuard } from '../auth/jwt/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Notifications")
@ApiBearerAuth()
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.notificationService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserNotifications(@Req() req) {
    return this.notificationService.getUserNotifications(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read/:id')
  markAsRead(@Param('id') id: string) {
    return this.notificationService.markAsRead(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('read-all')
  markAllAsRead(@Req() req) {
    return this.notificationService.markAllAsRead(req.user.id);
  }
}
