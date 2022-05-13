import axios, { AxiosResponse } from 'axios';
import { CreateStatusDto } from '../models/dto/status/create-status.dto';
import { Status } from '../models/Status';
import { BaseService } from './BaseService';

export class StatusService extends BaseService {
  public async getAll(): Promise<Status[]> {
    const result: AxiosResponse<Status[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/status`, this.headersWithToken())
    );
    return result.data;
  }

  public async addStatus(dto: CreateStatusDto) {
    const result: AxiosResponse<Status> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/status`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async updateStatus(dto: CreateStatusDto, statusId: string) {
    const result: AxiosResponse<Status> = await this.wrapper.handle(
      axios.patch(`${this.BASE_URL}/status/${statusId}`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async deleteStatus(statusId: string) {
    const result: AxiosResponse<Status> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/status/${statusId}`, this.headersWithToken())
    );
    return result.data;
  }
}
