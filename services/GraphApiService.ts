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
    return result.data;
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

  public async getUserProfilePhoto(id: string) {
    const token = await this.getGraphApiAccessToken();

    try {
      const result = await axios.get(
        `https://graph.microsoft.com/v1.0/users/${id}/photo/$value`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: 'blob',
        }
      );

      return result.data;
    } catch (err) {
      return null;
    }
  }

  private async getGraphApiAccessToken() {
    const result = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/graph-api/access-token`,
        this.headersWithToken()
      )
    );

    return result.data;
  }
}
