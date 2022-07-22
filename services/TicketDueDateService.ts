import axios, { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import { TicketDueDate } from '../models/TicketDueDate';

export class TicketDueDateService extends BaseService {
  public async getAllByTicketId(ticketId: string): Promise<TicketDueDate[]> {
    const result: AxiosResponse<TicketDueDate[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/ticket-due-dates/byTicket?ticketId=${ticketId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
