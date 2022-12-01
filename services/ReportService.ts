import axios, { AxiosResponse } from 'axios';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategoryt';
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
}
