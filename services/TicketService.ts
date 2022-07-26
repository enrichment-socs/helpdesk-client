import axios, { AxiosResponse } from 'axios';
import { PendingTicketFilterModel, Ticket, TicketFilterModel } from '../models/Ticket';
import { CreateTicketDto } from '../models/dto/tickets/create-ticket.dto';
import { BaseService } from './BaseService';
import { TicketSummary } from '../models/TicketSummary';
import { STATUS } from '../shared/constants/status';

export class TicketService extends BaseService {
  public async getTicketsBySemester(
    semesterId: string,
    filter: TicketFilterModel,
    take?: number,
    skip?: number
  ): Promise<{ count: number; tickets: Ticket[] }> {
    const { priority = '', status = '', query = '' } = filter;

    const url = `${this.BASE_URL}/tickets?semesterId=${semesterId}&take=${take}&skip=${skip}&priority=${priority}&status=${status}&query=${query}`;
    const result: AxiosResponse<{
      count: number;
      tickets: Ticket[];
    }> = await this.wrapper.handle(axios.get(url, this.headersWithToken()));

    return result.data;
  }

  public async getPendingTicketsBySemester(
    semesterId: string,
    filter: PendingTicketFilterModel,
    take?: number,
    skip?: number
  ): Promise<{ count: number; tickets: Ticket[] }> {
    const { priority = '', query = '' } = filter;

    const url = `${this.BASE_URL}/tickets/pending?semesterId=${semesterId}&take=${take}&skip=${skip}&priority=${priority}&query=${query}`;
    const result: AxiosResponse<{
      count: number;
      tickets: Ticket[];
    }> = await this.wrapper.handle(axios.get(url, this.headersWithToken()));

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

  public async deleteById(id: string) {
    const result: AxiosResponse<any> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/tickets/${id}`, this.headersWithToken())
    );

    return result.data;
  }

  public async getTicketSummary(semesterId: string) {
    const result: AxiosResponse<TicketSummary> = await this.wrapper.handle(
      axios.get(
        `${this.BASE_URL}/tickets/summary/${semesterId}`,
        this.headersWithToken()
      )
    );

    return result.data;
  }
}
