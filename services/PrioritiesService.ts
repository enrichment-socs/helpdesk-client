import axios, { AxiosResponse } from 'axios';
import { CreatePriorityDto } from '../models/dto/priority/create-prioritiy.dto';
import { Priority } from '../models/Priority';
import { BaseService } from './BaseService';

export class PrioritiesService extends BaseService {
  public async getAll(): Promise<Priority[]> {
    const result: AxiosResponse<Priority[]> = await this.wrapper.handle(
      axios.get(`${this.BASE_URL}/priority`)
    );
    return result.data;
  }

  public async add(dto: CreatePriorityDto): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.post(`${this.BASE_URL}/priority`, dto)
    );
    return result.data;
  }

  public async update(dto: CreatePriorityDto, id: string): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.put(`${this.BASE_URL}/priority/${id}`, dto)
    );
    return result.data;
  }

  public async delete(id: string): Promise<Priority> {
    const result: AxiosResponse<Priority> = await this.wrapper.handle(
      axios.delete(`${this.BASE_URL}/priority/${id}`)
    );
    return result.data;
  }
}
