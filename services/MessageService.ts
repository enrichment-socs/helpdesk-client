import axios, { AxiosResponse } from 'axios';
import { Message } from '../models/Message';
import { BaseService } from './BaseService';

type GetMessagesResult = {
  messages: Message[];
  count: number;
};

export class MessageService extends BaseService {
  public async getMessages(
    take?: number,
    skip?: number
  ): Promise<GetMessagesResult> {
    const result: AxiosResponse<GetMessagesResult> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/messages?take=${take}&skip=${skip}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }

  public async getMessagesByConversation(conversationId: string) {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/messages/conversations/${conversationId}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }

  public async markAsJunk(messageId: string) {
    const result = await this.wrapper.handle(
      axios.post<unknown>(
        `${this.BASE_URL}/messages/${messageId}/mark-as-junk`,
        {},
        this.headersWithToken()
      )
    );

    return result.data;
  }
}
