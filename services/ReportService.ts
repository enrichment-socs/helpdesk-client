import axios, { AxiosResponse } from 'axios';
import { TicketCountByCategory } from '../models/reports/TicketCountByCategory';
import { TicketCountByHandler } from '../models/reports/TicketCountByHandler';
import { TicketCountByMonth } from '../models/reports/TicketCountByMonth';
import { TicketCountByPriority } from '../models/reports/TicketCountByPriority';
import { TicketCountByStatus } from '../models/reports/TicketCountByStatus';
import { BaseService } from './BaseService';

export class ReportService extends BaseService {
  public async getTicketsCountByCategories(
    semesterId: string = '',
    userId: string = ''
  ) {
    const result: AxiosResponse<TicketCountByCategory[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-categories?semesterId=${semesterId}&userId=${userId}`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByStatuses(
    semesterId: string = '',
    userId: string = ''
  ) {
    const result: AxiosResponse<TicketCountByStatus[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-statuses?semesterId=${semesterId}&userId=${userId}`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByPriorities(
    semesterId: string = '',
    userId: string = ''
  ) {
    const result: AxiosResponse<TicketCountByPriority[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-priorities?semesterId=${semesterId}&userId=${userId}`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByHandlers(semesterId: string = '') {
    const result: AxiosResponse<TicketCountByHandler[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-handlers?semesterId=${semesterId}`,
          this.headersWithToken()
        )
      );
    return result.data;
  }

  public async getTicketsCountByMonths(
    semesterId: string = '',
    userId: string = ''
  ) {
    const result: AxiosResponse<TicketCountByMonth[]> =
      await this.wrapper.handle(
        axios.get(
          `${this.BASE_URL}/reports/tickets-count-by-months?semesterId=${semesterId}&userId=${userId}`,
          this.headersWithToken()
        )
      );
    return result.data;
  }
}
