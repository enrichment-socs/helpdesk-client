import axios, { AxiosResponse } from 'axios';
import { CreatePriorityDto } from '../models/dto/priority/create-prioritiy.dto';
import { Priority } from '../models/Priority';
import { BaseService } from './BaseService';

export class PriorityService extends BaseService {
  public async getAll(take?: number, skip?: number): Promise<{count: number; ticketPriorities: Priority[]}> {
    let url = `${this.BASE_URL}/priority`;

    if (
      take !== null &&
      take !== undefined &&
      skip !== null &&
      skip !== undefined
    ) {
      url += `?take=${take}&skip=${skip}`;
    }

    const result: AxiosResponse<{count: number; ticketPriorities: Priority[]}> = await this.wrapper.handle(
      axios.get(url, this.headersWithToken())
    );
    return result.data;
  }

  public async add(dto: CreatePriorityDto): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/priority`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async update(dto: CreatePriorityDto, id: string): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.put(`${this.BASE_URL}/priority/${id}`, dto, this.headersWithToken())
    );
    return result.data;
  }

  public async delete(id: string): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/priority/${id}`, this.headersWithToken())
    );
    return result.data;
  }
}
