import { BaseService } from './BaseService';
import axios, { AxiosResponse } from 'axios';
import { Message } from '../models/Message';
import { OutlookMessage } from '../models/OutlookMessage';
import { OutlookMessageAttachment } from '../models/OutlookMessageAttachment';

export class GraphApiService extends BaseService {
  public static async getMessages(accessToken: string): Promise<Message[]> {
    try {
      const result: AxiosResponse<Message[]> = await axios.get(
        `${this.BASE_URL}/graph-api/messages`,
        this.headersWithToken(accessToken)
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong when getting messages from server'
      );
    }
  }

  public static async syncMessages(accessToken: string): Promise<void> {
    try {
      await axios.post(
        `${this.BASE_URL}/graph-api/sync`,
        {},
        this.headersWithToken(accessToken)
      );
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong when syncing messages from server'
      );
    }
  }

  public static async getMessageById(
    id: string,
    accessToken: string
  ): Promise<OutlookMessage> {
    try {
      const result = await axios.get(
        `${this.BASE_URL}/graph-api/messages/${id}`,
        this.headersWithToken(accessToken)
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong when retrieving message from server'
      );
    }
  }

  public static async getMessageAttachments(
    id: string,
    accessToken: string
  ): Promise<OutlookMessageAttachment> {
    try {
      const result = await axios.get(
        `${this.BASE_URL}/graph-api/messages/${id}/attachments`,
        this.headersWithToken(accessToken)
      );
      return result.data;
    } catch (e) {
      console.error(e);
      throw new Error(
        'Ups, something is wrong when retrieving message from server'
      );
    }
  }
}
