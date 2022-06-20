import axios, { AxiosResponse } from 'axios';
import { TicketStatus } from '../models/TicketStatus';
import { CreateTicketStatusDto } from '../models/dto/ticket-statuses/create-ticket-status.dto';
import { BaseService } from './BaseService';

export class TicketStatusService extends BaseService {
  public async add(dto: CreateTicketStatusDto): Promise<TicketStatus> {
    const result: AxiosResponse<TicketStatus> = await this.wrapper.handle(
      axios.post(
        `${this.BASE_URL}/ticket-statuses`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async getAllByTicketId(ticketId: string): Promise<TicketStatus[]> {
    const result: AxiosResponse<TicketStatus[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/ticket-statuses/byTicket?ticketId=${ticketId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
