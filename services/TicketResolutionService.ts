import axios, { AxiosResponse } from 'axios';
import { CreateTicketResolutionDto } from '../models/dto/ticket-resolutions/create-ticket-resolution.dto';
import { TicketResolution } from '../models/TicketResolution';
import { BaseService } from './BaseService';

export class TicketResolutionService extends BaseService {
  public async add(dto: CreateTicketResolutionDto): Promise<TicketResolution> {
    const result: AxiosResponse<TicketResolution> = await this.wrapper.handle(
      axios.post(
        `${this.BASE_URL}/ticket-resolutions`,
        dto,
        this.headersWithToken()
      )
    );
    return result.data;
  }

  public async getByTicketId(ticketId: string): Promise<TicketResolution[]> {
    const result: AxiosResponse<TicketResolution[]> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/ticket-resolutions/byTicket?ticketId=${ticketId}`,
        this.headersWithToken()
      )
    );
    return result.data;
  }
}
