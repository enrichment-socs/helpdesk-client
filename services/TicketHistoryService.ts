import axios, { AxiosResponse } from 'axios';
import { TicketHistory } from '../models/TicketHistory';
import { BaseService } from './BaseService';

export class TicketHistoryService extends BaseService {
  public async getAllByTicketId(ticketId: string) {
    const url = `${this.BASE_URL}/ticket_histories/ticket?ticketId=${ticketId}`;

    const res: AxiosResponse<TicketHistory[]> = await this.wrapper.handle(
      axios.get(url, this.headersWithToken())
    );

    return res.data;
  }

  public async getAllByTicketIdGroupedByDate(ticketId: string) {
    const url = `${this.BASE_URL}/ticket_histories/groupedByDate?ticketId=${ticketId}`;

    const res: AxiosResponse<{ date: string; histories: TicketHistory[] }[]> =
      await this.wrapper.handle(axios.get(url, this.headersWithToken()));

    return res.data;
  }
}
