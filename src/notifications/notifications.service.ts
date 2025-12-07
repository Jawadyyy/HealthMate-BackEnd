import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { Notification } from './schemas/notification.schema/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<Notification>
  ) {}

  async create(dto: CreateNotificationDto) {
    return this.notificationModel.create(dto);
  }

  async getUserNotifications(userId: string) {
    return this.notificationModel.find({ userId }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string) {
    return this.notificationModel.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
  }

  async markAllAsRead(userId: string) {
    return this.notificationModel.updateMany({ userId }, { isRead: true });
  }

  async deleteNotification(id: string, userId: string) {
    const notification = await this.notificationModel.findById(id);

    if (!notification) throw new NotFoundException('Notification not found');

    if (notification.userId.toString() !== userId)
      throw new ForbiddenException('You cannot delete another user’s notification');

    return this.notificationModel.deleteOne({ _id: id });
  }

  async clearAllNotifications(userId: string) {
    return this.notificationModel.deleteMany({ userId });
  }
}
