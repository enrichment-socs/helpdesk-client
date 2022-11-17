import axios, { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';

export class NotificationService extends BaseService {
  public async getNotificationsByUser(
    take?: number,
    skip?: number
  ): Promise<any> {
    const result: AxiosResponse<any> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/notifications?take=${take}&skip=${skip}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
