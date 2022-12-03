import axios, { AxiosResponse } from 'axios';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategory';
import { TicketCountByHandler } from '../models/reports/TicketCountByHandler';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';
import { BaseService } from './BaseService';

export class ReportService extends BaseService {
  public async getTicketsCountByCategories() {
    const result: AxiosResponse<TicketCountByCategory[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-categories`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByStatuses() {
    const result: AxiosResponse<TicketCountByStatus[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-statuses`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByPriorities() {
    const result: AxiosResponse<TicketCountByPriority[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-priorities`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByHandlers() {
    const result: AxiosResponse<TicketCountByHandler[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-handlers`,
          this.headersWithToken()
        )
      );
    return result.data;
  }
}
