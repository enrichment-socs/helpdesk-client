import { BaseService } from './BaseService';
import axios, { AxiosResponse } from 'axios';
import { Message } from '../models/Message';
import { OutlookMessage } from '../models/OutlookMessage';
import { OutlookMessageAttachment } from '../models/OutlookMessageAttachment';

export class GraphApiService extends BaseService {
  public async getMessages(): Promise<Message[]> {
    const result: AxiosResponse<Message[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/graph-api/messages`, this.headersWithToken())
    );
    return result.data;
  }

  public async syncMessages(): Promise<void> {
    await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/graph-api/sync`, {}, this.headersWithToken())
    );
  }

  public async getMessageById(id: string): Promise<OutlookMessage> {
    const result: AxiosResponse<OutlookMessage> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/messages/${id}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async getMessagesByConversation(
    conversationId: string
  ): Promise<OutlookMessage[]> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/messages/conversations/${conversationId}`,
        this.headersWithToken()
      )
    );
    return result.data.value;
  }

  public async getFirstMessageByConversation(
    conversationId: string
  ): Promise<OutlookMessage> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/messages/conversations/${conversationId}/first`,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async getMessageAttachments(
    id: string
  ): Promise<OutlookMessageAttachment> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/messages/${id}/attachments`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
