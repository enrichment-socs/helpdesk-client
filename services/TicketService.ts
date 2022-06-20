import axios, { AxiosResponse } from 'axios';
import { Ticket } from '../models/Ticket';
import { CreateTicketDto } from '../models/dto/tickets/create-ticket.dto';
import { BaseService } from './BaseService';

export class TicketService extends BaseService {
  public async getTickets(requesterEmail?: string): Promise<Ticket[]> {
    const result: AxiosResponse<Ticket[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/tickets?requesterEmail=${requesterEmail ?? ''}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }

  public async add(dto: CreateTicketDto) {
    const result: AxiosResponse<Ticket> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/tickets`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async get(id: string) {
    const result: AxiosResponse<Ticket> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/tickets/${id}`, this.headersWithToken())
    );

    return result.data;
  }
}
