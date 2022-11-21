import axios, { AxiosResponse } from 'axios';
import { Notification } from '../models/Notification';
import { BaseService } from './BaseService';

export class NotificationService extends BaseService {
  public async getNotificationsByUser(
    take?: number,
    skip?: number
  ): Promise<{
    notifications: Notification[];
    count: number;
    unreadCount: number;
  }> {
    const result: AxiosResponse<{
      notifications: Notification[];
      count: number;
      unreadCount: number;
    }> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/notifications?take=${take ?? 10}&skip=${skip ?? 0}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async markAllAsRead(): Promise<void> {
    const result: AxiosResponse<void> = await this.wrapper.handle(
      axios.put(
        `${this.BASE_URL}/notifications/mark-all-as-read`,
        undefined,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async markAsRead(id: string): Promise<void> {
    const result: AxiosResponse<void> = await this.wrapper.handle(
      axios.put(
        `${this.BASE_URL}/notifications/${id}/read`,
        undefined,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
