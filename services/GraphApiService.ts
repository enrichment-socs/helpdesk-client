import { BaseService } from './BaseService';
import axios, { AxiosResponse } from 'axios';
import { Message } from '../models/Message';

export class GraphApiService extends BaseService {
  public static async getMessages(accessToken: string): Promise<Message[]> {
    try {
      const result: AxiosResponse<Message[]> = await axios.get(
        `${this.BASE_URL}/graph-api/messages`,
        this.headersWithToken(accessToken),
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error('Ups, something is wrong when getting messages from server');
    }
  }
}
