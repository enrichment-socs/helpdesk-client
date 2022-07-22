import axios, { AxiosResponse } from 'axios';
import { BaseService } from './BaseService';
import { TicketDueDate } from '../models/TicketDueDate';
import { CreateTicketDueDateDto } from '../models/dto/ticket-due-dates/create-ticket-due-date.dto';

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

  public async add(dto: CreateTicketDueDateDto): Promise<TicketDueDate> {
    const result: AxiosResponse<TicketDueDate> = await this.wrapper.handle(
      axios.post(
        `${this.BASE_URL}/ticket-due-dates`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
