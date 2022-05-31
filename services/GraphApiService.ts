import { BaseService } from './BaseService';
import axios, { AxiosResponse } from 'axios';
import { OutlookMessage } from '../models/OutlookMessage';
import { OutlookMessageAttachment } from '../models/OutlookMessageAttachment';
import { GraphUser } from '../models/GraphUser';

export class GraphApiService extends BaseService {
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

  public async getUserInfoByEmail(email: string): Promise<GraphUser> {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/users/email/${email}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }
}
